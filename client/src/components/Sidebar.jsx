import React from "react";
import "../styles/sidebar.css";

function Sidebar({ activePage }) {
  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Tasks", icon: "📝", path: "/tasks" },
    { name: "Flashcards", icon: "📚", path: "/flashcards" },
    { name: "Notes", icon: "📂", path: "/notes" },
    { name: "Calendar", icon: "👥", path: "/calendar" },
    { name: "Logout", icon: "🚪", path: "/logout" },
  ];

  return (
    <aside className="sidebar">
      <h2><u>Study-Buddy 📚💻</u></h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.name} className={activePage === item.name ? "active" : ""}>
            <a href={item.path} style={{ color: "white", textDecoration: "none" }}>
              {item.icon} {item.name}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
