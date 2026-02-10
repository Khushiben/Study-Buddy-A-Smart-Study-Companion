import React from "react";
import "../styles/Dashboard.css";

function Marquee({ title, username }) {
  return (
    <marquee behavior="scroll" direction="left" scrollamount="10">
      <h2>
        {title}
        {username && `, ${username}`} 👋
      </h2>
    </marquee>
  );
}

export default Marquee;
