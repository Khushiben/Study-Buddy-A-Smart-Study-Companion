import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ activePage }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Tasks", icon: "📝", path: "/tasks" },
    { name: "Flashcards", icon: "📚", path: "/flashcards" },
    { name: "Notes", icon: "📂", path: "/notes" },
    { name: "Calendar", icon: "👥", path: "/calendar" },
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
      <h2><u>Study-Buddy 📚💻</u></h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={activePage === item.name ? "active" : ""}
            onClick={() =>
              item.name === "Logout"
                ? handleLogout()
                : navigate(item.path)
            }
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
