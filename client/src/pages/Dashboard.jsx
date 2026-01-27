import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import "../styles/Dashboard.css";

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
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
    .then((res) => setUsername(res.data.username))
    .catch(() => setUsername("User"));
  }, [token]);

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return alert("⚠️ Please enter a task title!");

    axios.post(
      "http://localhost:5000/api/tasks",
      { title: taskTitle, description: taskDesc },
      { headers: { Authorization: `Bearer ${token}` } }
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
      <Sidebar activePage="Dashboard" />

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
        <Footer />
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3>Steps to use Study Buddy</h3>
        <ol>
          <li>Add your tasks in the "Add Task" section.</li>
          <li>Start working on a task and track time using timers.</li>
          <li>Generate flashcards to aid studying.</li>
          <li>Upload your notes for reference.</li>
          <li>Use the <strong>Study Circle</strong> feature to connect and study with peers.</li>
          <li>Review completed tasks and stay productive!</li>
        </ol>
      </Modal>

      
    </div>
    
  );
  
};

export default Dashboard;
