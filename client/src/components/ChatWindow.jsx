import React from "react";
import MessageBubble from "./MessageBubble";

function ChatWindow({
  selectedGroup,
  messages,
  currentUserId,
  loadingMessages,
  messageText,
  setMessageText,
  onSendMessage,
  onOpenShareNote,
  connected,
  membersText,
}) {
  if (!selectedGroup) {
    return (
      <section className="study-circle-chat-panel empty">
        <h3>Select a group to start chatting</h3>
        <p className="muted">Create a new group or join an existing group by ID.</p>
      </section>
    );
  }

  return (
    <section className="study-circle-chat-panel">
      <header className="chat-header">
        <div>
          <h3>{selectedGroup.name}</h3>
          <p className="muted">{membersText}</p>
        </div>
        <span className={`socket-status ${connected ? "online" : "offline"}`}>
          {connected ? "Live" : "Reconnecting..."}
        </span>
      </header>

      <div className="chat-messages">
        {loadingMessages ? <p className="muted">Loading messages...</p> : null}

        {!loadingMessages && messages.length === 0 ? (
          <p className="muted">No messages yet. Start with an intro message.</p>
        ) : null}

        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isOwnMessage={message.sender?._id === currentUserId}
          />
        ))}
      </div>

      <form className="chat-composer" onSubmit={onSendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button type="button" className="secondary" onClick={onOpenShareNote}>
          Share Note
        </button>
        <button type="submit">Send</button>
      </form>
    </section>
  );
}

export default ChatWindow;