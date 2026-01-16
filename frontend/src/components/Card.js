import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Card = ({ card, index, onDelete, onClick }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${card.title}"?`)) {
      onDelete(card.id);
    }
  };

  const handleClick = (e) => {
    if (e.target.closest('.delete-btn')) {
      return;
    }
    onClick(card);
  };

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const isDueSoon = card.dueDate && new Date(card.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided, snapshot) => (
        <div
          className="card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform} rotate(3deg)` 
              : provided.draggableProps.style?.transform,
            opacity: snapshot.isDragging ? 0.9 : 1,
            borderLeft: isOverdue 
              ? '4px solid var(--danger)' 
              : (isDueSoon && !isOverdue) 
              ? '4px solid var(--warning)' 
              : 'none',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <h4 className="card-title" style={{ flex: 1, marginBottom: '8px' }}>{card.title}</h4>
            <button
              className="delete-btn"
              onClick={handleDelete}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'all var(--transition-speed) ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--danger)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--text-secondary)';
              }}
              title="Delete card"
            >
              ×
            </button>
          </div>
          {card.description && (
            <p style={{ 
              margin: '0 0 12px 0', 
              fontSize: '13px', 
              color: 'var(--text-secondary)',
              lineHeight: '1.5'
            }}>
              {card.description.length > 80 ? card.description.substring(0, 80) + '...' : card.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {card.attachments && card.attachments.length > 0 && (
              <span 
                style={{ 
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: '500'
                }}
              >
                📎 {card.attachments.length}
              </span>
            )}
            {card.dueDate && (
              <span 
                style={{  
                  fontSize: '12px', 
                  padding: '4px 10px', 
                  borderRadius: '6px',
                  backgroundColor: isOverdue 
                    ? 'var(--danger)' 
                    : (isDueSoon && !isOverdue) 
                    ? 'var(--warning)' 
                    : 'var(--bg-tertiary)',
                  color: (isOverdue || (isDueSoon && !isOverdue)) ? 'white' : 'var(--text-primary)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                📅 {formatDate(card.dueDate)}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;