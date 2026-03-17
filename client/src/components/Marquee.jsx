import React from "react";
import "../styles/Dashboard.css";

function Marquee({ title, username }) {
  return (
    <div className="marquee-container">
      <div className="marquee-text">
        <h2>
          {title}
          {username && `, ${username}`} 👋
        </h2>
      </div>
    </div>
  );
}

export default Marquee;
