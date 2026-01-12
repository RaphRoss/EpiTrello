import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import Modal from './Modal';

const List = ({ list, cards, onCreateCard, onDeleteCard, onDeleteList, onCardClick }) => {
  const [showCardModal, setShowCardModal] = useState(false);

  const handleCreateCard = (data) => {
    onCreateCard(data, list.id);
    setShowCardModal(false);
  };

  const handleDeleteList = () => {
    if (window.confirm(`Are you sure you want to delete "${list.title}" and all its cards?`)) {
      onDeleteList(list.id);
    }
  };

  return (
    <>
      <div className="list">
        <div className="list-header">
          <h3 className="list-title">
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {list.title}
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)'
              }}>
                {cards.length}
              </span>
            </span>
          </h3>
          <div className="list-actions">
            <button 
              className="btn"
              onClick={() => setShowCardModal(true)}
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '6px 10px'
              }}
              title="Add card"
            >
              +
            </button>
            <button 
              className="btn"
              onClick={handleDeleteList}
              style={{ 
                fontSize: '16px',
                padding: '6px 10px',
                transition: 'all var(--transition-speed) ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--danger)';
                e.target.style.color = 'white';
                e.target.style.borderColor = 'var(--danger)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'var(--bg-hover)';
                e.target.style.color = 'var(--text-primary)';
                e.target.style.borderColor = 'var(--border-color)';
              }}
              title="Delete list"
            >
              🗑️
            </button>
          </div>
        </div>
        
        <Droppable droppableId={String(list.id)}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                backgroundColor: snapshot.isDraggingOver ? 'var(--bg-hover)' : 'transparent',
                minHeight: '50px',
                borderRadius: 'var(--border-radius-sm)',
                transition: 'background-color var(--transition-speed) ease',
                padding: snapshot.isDraggingOver ? '8px' : '0'
              }}
            >
              {cards.map((card, index) => (
                <Card key={card.id} card={card} index={index} onDelete={onDeleteCard} onClick={onCardClick} />
              ))}
              {provided.placeholder}
              
              <div 
                className="add-card"
                onClick={() => setShowCardModal(true)}
              >
                + Add a card
              </div>
            </div>
          )}
        </Droppable>
      </div>

      {showCardModal && (
        <Modal
          title="Create New Card"
          onClose={() => setShowCardModal(false)}
          onSubmit={handleCreateCard}
          fields={[
            { name: 'title', label: 'Card Title', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'dueDate', label: 'Due Date', type: 'date' }
          ]}
        />
      )}
    </>
  );
};

export default List;