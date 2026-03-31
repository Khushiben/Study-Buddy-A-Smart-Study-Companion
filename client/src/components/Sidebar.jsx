import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ activePage, active }) {
  const navigate = useNavigate();
  // support both prop names for backward compatibility
  const currentActive = activePage || active;

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Profile", icon: "👤", path: "/profile" },
    { name: "Tasks", icon: "📝", path: "/Tasks" },
    { name: "Flashcards", icon: "📚", path: "/flashcards" },
    { name: "Notes", icon: "📂", path: "/notes" },
    { name: "Calendar", icon: "👥", path: "/calendar" },
    { name: "Study Circle", icon: "💬", path: "/study-circle" },
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
            className={currentActive === item.name ? "active" : ""}
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
