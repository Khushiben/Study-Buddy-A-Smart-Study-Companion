import React from "react";

function NoteShareModal({ open, onClose, notes, onShare, sharing }) {
  if (!open) return null;

  return (
    <div className="note-share-overlay" onClick={onClose}>
      <div className="note-share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="note-share-header">
          <h3>Share a Note</h3>
          <button type="button" onClick={onClose}>
            X
          </button>
        </div>

        <div className="note-share-list">
          {notes.length === 0 ? <p className="muted">No notes available to share.</p> : null}

          {notes.map((note) => (
            <div className="note-share-item" key={note._id}>
              <div>
                <h4>{note.subject}</h4>
                {note.content ? <p>{note.content.slice(0, 120)}</p> : null}
                <small>{new Date(note.createdAt).toLocaleDateString()}</small>
              </div>
              <button type="button" disabled={sharing} onClick={() => onShare(note._id)}>
                Share
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NoteShareModal;