import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Board from './components/Board';
import Modal from './components/Modal';
import CardDetailModal from './components/CardDetailModal';
import CreateBoardModal from './components/CreateBoardModal';
import Notifications from './components/Notifications';
import Login from './components/Login';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { boardsApi, listsApi, cardsApi, uploadsApi, templatesApi } from './services/api';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';

function App() {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setShowLogin(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowLogin(true);
  };

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Handle socket events
  useEffect(() => {
    if (!socket || !currentBoard) return;

    socket.emit('join-board', currentBoard.id);

    socket.on('card-created', (card) => {
      setCards(prev => [...prev, card]);
    });

    socket.on('card-updated', (updatedCard) => {
      setCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    });

    socket.on('card-deleted', (cardId) => {
      setCards(prev => prev.filter(c => c.id !== cardId));
    });

    socket.on('list-created', (list) => {
      setLists(prev => [...prev, list]);
    });

    socket.on('list-updated', (updatedList) => {
      setLists(prev => prev.map(l => l.id === updatedList.id ? updatedList : l));
    });

    socket.on('list-deleted', (listId) => {
      setLists(prev => prev.filter(l => l.id !== listId));
      setCards(prev => prev.filter(c => c.listId !== listId));
    });

    return () => {
      socket.emit('leave-board', currentBoard.id);
      socket.off('card-created');
      socket.off('card-updated');
      socket.off('card-deleted');
      socket.off('list-created');
      socket.off('list-updated');
      socket.off('list-deleted');
    };
  }, [socket, currentBoard]);

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (currentBoard) {
      loadLists(currentBoard.id);
    }
  }, [currentBoard]);

  useEffect(() => {
    if (lists.length > 0) {
      loadAllCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists]);

  const loadBoards = async () => {
    try {
      const response = await boardsApi.getAll();
      setBoards(response.data);
      if (response.data.length > 0) {
        setCurrentBoard(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLists = async (boardId) => {
    try {
      const response = await listsApi.getByBoardId(boardId);
      setLists(response.data.sort((a, b) => a.position - b.position));
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  const loadAllCards = async () => {
    try {
      const allCards = [];
      for (const list of lists) {
        const response = await cardsApi.getByListId(list.id);
        allCards.push(...response.data);
      }
      setCards(allCards.sort((a, b) => a.position - b.position));
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const createBoard = async (data) => {
    try {
      let response;
      if (data.templateId) {
        // Create board from template
        response = await templatesApi.createBoard(data.templateId, {
          name: data.name,
          userId: user?.id
        });
      } else {
        // Create blank board
        response = await boardsApi.create({ 
          name: data.name, 
          description: data.description 
        });
      }
      
      const newBoard = response.data;
      setBoards([...boards, newBoard]);
      setCurrentBoard(newBoard);
      setShowBoardModal(false);
      
      // Reload lists and cards for the new board
      await loadLists(newBoard.id);
    } catch (error) {
      console.error('Error creating board:', error);
      alert('Failed to create board');
    }
  };

  const deleteBoard = async () => {
    if (!currentBoard) return;
    
    if (!window.confirm(`Are you sure you want to delete "${currentBoard.name}" and all its lists and cards?`)) {
      return;
    }

    try {
      await boardsApi.delete(currentBoard.id);
      const updatedBoards = boards.filter(b => b.id !== currentBoard.id);
      setBoards(updatedBoards);
      setCurrentBoard(updatedBoards.length > 0 ? updatedBoards[0] : null);
      setLists([]);
      setCards([]);
      
      if (socket && currentBoard) {
        socket.emit('board-deleted', { boardId: currentBoard.id });
      }
    } catch (error) {
      console.error('Error deleting board:', error);
      alert('Failed to delete board');
    }
  };

  const createList = async (name) => {
    if (!currentBoard) return;
    
    try {
      const response = await listsApi.create({ 
        title: name,
        boardId: currentBoard.id,
        position: lists.length 
      });
      setLists([...lists, response.data]);
      if (socket) {
        socket.emit('list-created', { boardId: currentBoard.id, list: response.data });
      }
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const createCard = async (cardData, listId) => {
    try {
      const listCards = cards.filter(card => card.listId === listId);
      
      // Upload attachments if any
      let uploadedAttachments = [];
      if (cardData.attachments && cardData.attachments.length > 0) {
        const cardId = Date.now().toString();
        const uploadPromises = cardData.attachments.map(async (att) => {
          try {
            const uploadResponse = await uploadsApi.upload({
              fileName: att.fileName,
              fileData: att.fileData,
              cardId: cardId
            });
            return {
              fileName: att.fileName,
              storedName: uploadResponse.data.storedName,
              size: att.size
            };
          } catch (err) {
            console.error('Error uploading file:', err);
            return null;
          }
        });
        uploadedAttachments = (await Promise.all(uploadPromises)).filter(a => a !== null);
      }

      const response = await cardsApi.create({ 
        title: typeof cardData === 'string' ? cardData : cardData.title,
        description: typeof cardData === 'object' ? cardData.description : '',
        dueDate: typeof cardData === 'object' ? cardData.dueDate : null,
        attachments: uploadedAttachments,
        listId,
        position: listCards.length 
      });
      setCards([...cards, response.data]);
      if (socket && currentBoard) {
        socket.emit('card-created', { boardId: currentBoard.id, card: response.data });
      }
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await cardsApi.delete(cardId);
      setCards(cards.filter(c => c.id !== cardId));
      if (socket && currentBoard) {
        socket.emit('card-deleted', { boardId: currentBoard.id, cardId });
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCardUpdate = async (updatedCard) => {
    try {
      const response = await cardsApi.update(updatedCard.id, updatedCard);
      setCards(cards.map(card => card.id === updatedCard.id ? response.data : card));
      setSelectedCard(response.data);
      
      if (socket && currentBoard) {
        socket.emit('card-updated', { boardId: currentBoard.id, card: response.data });
      }
    } catch (error) {
      console.error('Error updating card:', error);
      alert('Failed to update card');
    }
  };

  const deleteList = async (listId) => {
    try {
      await listsApi.delete(listId);
      // Also remove all cards associated with this list
      setCards(cards.filter(c => c.listId !== listId));
      setLists(lists.filter(l => l.id !== listId));
      if (socket && currentBoard) {
        socket.emit('list-deleted', { boardId: currentBoard.id, listId });
      }
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Convert draggableId string to number for comparison
    const cardId = parseInt(draggableId, 10);
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const updatedCards = cards.filter(c => c.id !== cardId);
    const newCard = {
      ...card,
      listId: parseInt(destination.droppableId, 10),
      position: destination.index
    };

    setCards([...updatedCards, newCard].sort((a, b) => a.position - b.position));

    try {
      await cardsApi.update(cardId, {
        listId: parseInt(destination.droppableId, 10),
        position: destination.index
      });
    } catch (error) {
      console.error('Error updating card:', error);
      // Revert on error
      setCards(cards);
    }
  };

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  if (showLogin) {
    return (
      <ThemeProvider>
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="app">
          <Notifications cards={cards} />
          <header className="header">
            <h1>✨ Epitrello</h1>
            <div className="header-actions">
              {user && !user.isGuest && (
                <span style={{ 
                  padding: '8px 16px',
                  background: 'var(--bg-hover)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  👤 {user.username}
                </span>
              )}
              {boards.length > 0 && (
                <select 
                  value={currentBoard?.id || ''} 
                  onChange={(e) => {
                    const boardId = parseInt(e.target.value, 10);
                    const board = boards.find(b => b.id === boardId);
                    setCurrentBoard(board);
                  }}
                  style={{ 
                    padding: '10px 16px',
                    borderRadius: 'var(--border-radius-sm)',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    minWidth: '180px',
                    transition: 'all var(--transition-speed) ease'
                  }}
                >
                  {boards.map(board => (
                    <option key={board.id} value={board.id}>{board.name}</option>
                  ))}
                </select>
              )}
              <button 
                className="btn-primary" 
                onClick={() => setShowBoardModal(true)}
              >
                ➕ New Board
              </button>
              {currentBoard && (
                <button 
                  className="btn-secondary" 
                  onClick={deleteBoard}
                  style={{ 
                    backgroundColor: 'var(--danger)', 
                    borderColor: 'var(--danger)',
                    color: 'white'
                  }}
                  title="Delete current board"
                >
                  🗑️ Delete
                </button>
              )}
              <ThemeToggle />
              {user && (
                <button 
                  className="btn-secondary" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </div>
          </header>

          {currentBoard ? (
            <Board 
              board={currentBoard}
              lists={lists}
              cards={cards}
              onCreateList={createList}
              onCreateCard={createCard}
              onDeleteCard={deleteCard}
              onDeleteList={deleteList}
              onCardClick={handleCardClick}
            />
          ) : (
            <div style={{ 
              color: 'var(--text-primary)', 
              textAlign: 'center', 
              marginTop: '100px',
              padding: '40px'
            }}>
              <h2 style={{ 
                fontSize: '36px', 
                marginBottom: '16px',
                fontWeight: '700',
                color: 'var(--text-primary)'
              }}>
                Welcome to Epitrello! 🎉
              </h2>
              <p style={{ 
                fontSize: '18px', 
                marginBottom: '32px',
                opacity: 0.9,
                color: 'var(--text-primary)'
              }}>
                Create your first board to get started.
              </p>
              <button 
                className="btn-primary" 
                onClick={() => setShowBoardModal(true)}
                style={{ fontSize: '16px', padding: '14px 32px' }}
              >
                Create Board
              </button>
            </div>
          )}

          {showBoardModal && (
            <CreateBoardModal
              onClose={() => setShowBoardModal(false)}
              onSubmit={createBoard}
            />
          )}

          {selectedCard && (
            <CardDetailModal
              card={selectedCard}
              userId={user?.id}
              onClose={() => setSelectedCard(null)}
              onUpdate={handleCardUpdate}
            />
          )}
        </div>
      </DragDropContext>
    </ThemeProvider>
  );
}

export default App;