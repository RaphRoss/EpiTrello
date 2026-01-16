import React, { useState } from 'react';
import CardComments from './CardComments';

const CardDetailModal = ({ card, onClose, onUpdate, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState({ ...card });

  const handleSave = () => {
    onUpdate(editedCard);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedCard(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content card-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          {isEditing ? (
            <input
              type="text"
              value={editedCard.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="form-input"
              style={{ fontSize: '20px', fontWeight: 'bold' }}
            />
          ) : (
            <h2 className="modal-title">{card.title}</h2>
          )}
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="card-detail-content">
          <div className="card-section">
            <h3>Description</h3>
            {isEditing ? (
              <textarea
                value={editedCard.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-textarea"
                rows="4"
              />
            ) : (
              <p>{card.description || 'No description'}</p>
            )}
          </div>

          <div className="card-section">
            <h3>Due Date</h3>
            {isEditing ? (
              <input
                type="date"
                value={editedCard.dueDate ? editedCard.dueDate.split('T')[0] : ''}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="form-input"
              />
            ) : (
              <p>{formatDate(card.dueDate)}</p>
            )}
          </div>

          {card.attachments && card.attachments.length > 0 && (
            <div className="card-section">
              <h3>Attachments ({card.attachments.length})</h3>
              <div className="attachments-list">
                {card.attachments.map((att, idx) => (
                  <div key={idx} className="attachment-item" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-sm)',
                    marginBottom: '8px',
                    border: '1px solid var(--border-color)',
                    transition: 'all var(--transition-speed) ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <span style={{ fontSize: '20px' }}>📎</span>
                      <div>
                        <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                          {att.originalName || att.fileName}
                        </div>
                        {att.fileSize && (
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {(att.fileSize / 1024).toFixed(1)} KB
                          </div>
                        )}
                      </div>
                    </div>
                    <a
                      href={`http://localhost:3001/api/uploads/download/${att.fileName}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'var(--accent-primary)',
                        color: 'white',
                        borderRadius: 'var(--border-radius-sm)',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: '500',
                        transition: 'all var(--transition-speed) ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#764ba2'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent-primary)'}
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-actions-section">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn-primary">
                  Save Changes
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn-primary">
                Edit Card
              </button>
            )}
          </div>

          <CardComments cardId={card.id} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
