import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import NotificationPanel from "../components/NotificationPanel";
import "../styles/Dashboard.css";
import Marquee from "../components/Marquee";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((res) => setUsername(res.data.name))
      .catch(() => setUsername("User"));
  }, [token]);

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return alert("⚠️ Please enter a task title!");

    axios
      .post(
        "http://localhost:5000/api/tasks",
        { title: taskTitle, description: taskDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setSuccess(res.data.message);
        setError("");
        setTaskTitle("");
        setTaskDesc("");
        alert("✅ Task added successfully!");
        // ✅ Redirect to Tasks page
        navigate("/tasks");
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
        <Marquee title="Welcome" username={username} />

        <div className="cards">
          <div className="card notifications-card">
            <NotificationPanel />
          </div>

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
            <button onClick={() => navigate("/flashcards")} className="card-btn">Go to Flashcards</button>
          </div>

          <div className="card">
            <h3>📂 Upload Notes</h3>
            <p>Upload your notes and view them on the Notes page.</p>
            <button onClick={() => navigate("/notes")} className="card-btn">Go to Notes</button>
          </div>

          <div className="card">
            <h3>👤 Profile</h3>
            <p>View and manage your profile information</p>
            <button onClick={() => navigate("/profile")} className="card-btn">View Profile</button>
          </div>

          <div className="card">
            <h3>📝 Tasks</h3>
            <p>View and organize all your study tasks</p>
            <button onClick={() => navigate("/tasks")} className="card-btn">View Tasks</button>
          </div>

          <div className="card">
            <h3>📅 Calendar</h3>
            <p>Plan your study schedule with our calendar</p>
            <button onClick={() => navigate("/calendar")} className="card-btn">Open Calendar</button>
          </div>

          <div className="card">
            <h3>💬 Study Circle</h3>
            <p>Connect and study with peers in real-time</p>
            <button onClick={() => navigate("/study-circle")} className="card-btn">Join Study Circle</button>
          </div>

          <div className="card">
            <h3>🧠 Learning Aptitude</h3>
            <p>Practice your logical reasoning and problem solving</p>
            <button onClick={() => navigate("/learning-aptitude")} className="card-btn">Practice Now</button>
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
          <li>
            Use the <strong>Study Circle</strong> feature to connect and study with peers.
          </li>
          <li>Practice and improve your logical reasoning and problem-solving skills through interactive aptitude quizzes.</li>
          <li>Review your progress and stay motivated!</li>
        </ol>
      </Modal>
    </div>
  );
};

export default Dashboard;
