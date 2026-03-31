import React from "react";

function MessageBubble({ message, isOwnMessage }) {
  const senderName = message.sender?.name || "Unknown";
  const createdAt = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={`message-row ${isOwnMessage ? "sent" : "received"}`}>
      <div className="message-bubble">
        <div className="message-meta">
          <strong>{senderName}</strong>
          <span>{createdAt}</span>
        </div>

        {message.text ? <p>{message.text}</p> : null}

        {message.note ? (
          <div className="note-attachment-card">
            <h5>Shared Note: {message.note.subject}</h5>
            {message.note.content ? <p>{message.note.content}</p> : null}
            {message.note.fileUrl ? (
              <a
                href={`http://localhost:5000${message.note.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Attachment
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MessageBubble;