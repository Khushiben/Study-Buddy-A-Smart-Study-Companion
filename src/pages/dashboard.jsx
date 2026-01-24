import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then((res) => setUsername(res.data.username))
      .catch(() => setUsername("User"));
  }, [token]);

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    if (!taskTitle.trim()) {
      alert("⚠️ Please enter a task title!");
      return;
    }

    axios.post(
      "http://localhost:5000/api/tasks",
      { title: taskTitle, description: taskDesc },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        setSuccess(res.data.message);
        setError("");
        setTaskTitle("");
        setTaskDesc("");
      })
      .catch((err) => {
        setError(err.response?.data?.error || "❌ Failed to add task.");
        setSuccess("");
      });
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2><u>Study-Buddy 📚💻</u></h2>
        <ul>
          <li className="active"><a href="#" style={{ color: "white", textDecoration: "none" }}>📊 Dashboard</a></li>
          <li><a href="/tasks" style={{ color: "white", textDecoration: "none" }}>📝 Tasks</a></li>
          <li><a href="/flashcards" style={{ color: "white", textDecoration: "none" }}>📚 Flashcards</a></li>
          <li><a href="/notes" style={{ color: "white", textDecoration: "none" }}>📂 Notes</a></li>
          <li><a href="/calendar" style={{ color: "white", textDecoration: "none" }}>👥 Calendar</a></li>
          <li><a href="/logout" style={{ color: "white", textDecoration: "none" }}>🚪 Logout</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main">
        <marquee behavior="scroll" direction="left" scrollamount="10">
          <h2>Welcome, {username} 👋</h2>
        </marquee>

        <div className="cards">
          <div className="card">
            <h3>💡 How this web works</h3>
            <p>Click the button to see the steps</p>
            <button onClick={() => setModalOpen(true)}>Click Me</button>
          </div>

          <div className="card">
            <h3>➕ Add Task</h3>
            <form onSubmit={handleTaskSubmit}>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title"
              />
              <textarea
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Task description"
              ></textarea>
              <button type="submit">Add Task</button>
            </form>

            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          <div className="card">
            <h3>📚 Flashcards</h3>
            <p>Make flashcards to help with last minute revision</p>
            <button onClick={() => window.location.href="/flashcards"}>Go to Flashcards</button>
          </div>

          <div className="card">
            <h3>📂 Upload Notes</h3>
            <p>Upload your notes and view them on the Notes page.</p>
            <button onClick={() => window.location.href="/notes"}>Go to Notes</button>
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h3>Steps to use Study Buddy</h3>
            <ol>
              <li>Add your tasks in the "Add Task" section.</li>
              <li>Start working on a task and track time using timers.</li>
              <li>Generate flashcards to aid studying.</li>
              <li>Upload your notes for reference.</li>
              <li>Use the <strong>Study Circle</strong> feature to connect and study with peers.</li>
              <li>Review completed tasks and stay productive!</li>
            </ol>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2025 Study Buddy. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
