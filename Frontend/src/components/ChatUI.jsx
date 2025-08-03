import React from "react";

export default function ChatUI({ messages }) {
  return (
    <ul className="chat-list">
      {messages.map((msg, idx) => (
        <li key={idx}>
          <b>{msg.from}:</b> {msg.content}
        </li>
      ))}
    </ul>
  );
}
