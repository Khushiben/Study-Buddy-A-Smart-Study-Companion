import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ activePage, active }) {
  const navigate = useNavigate();
  // support both prop names for backward compatibility
  const currentActive = activePage || active;

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Profile", icon: "👤", path: "/profile" },
    { name: "Tasks", icon: "📝", path: "/tasks" },
    { name: "Flashcards", icon: "📚", path: "/flashcards" },
    { name: "Notes", icon: "📂", path: "/notes" },
    { name: "Calendar", icon: "👥", path: "/calendar" },
    { name: "Study Circle", icon: "💬", path: "/study-circle" },
    { name: "Learning-Aptitude", icon: "🧠", path: "/learning-aptitude" },
    { name: "Logout", icon: "🚪" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔐 clear auth
    navigate("/login", {
      state: { message: "✅ Logged out successfully!" },
    });
  };

  return (
    <aside className="sidebar">

<div className="sidebar-header">
  <img src="/logo.jpg" alt="Study Buddy Logo" />
  <h2>Study-Buddy 📚</h2>
</div>

      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={currentActive === item.name ? "active" : ""}
            onClick={() => {
              if (item.name === "Logout") {
                handleLogout();
              } else if (item.path) {
                navigate(item.path);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <span style={{ color: "white", textDecoration: "none" }}>
              {item.icon} {item.name}
            </span>
          </li>
        ))}
      </ul>

    </aside>
  );
}

export default Sidebar;