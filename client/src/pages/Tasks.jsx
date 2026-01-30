import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import "../styles/Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, [token]);

  const fetchUser = () => {
    axios
      .get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsername(res.data.name))
      .catch(() => setUsername("User"));
  };

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTasks(data);
  };

const addTask = async (e) => {
  e.preventDefault();

  if (!taskTitle.trim()) {
    alert("⚠️ Task title cannot be empty");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: taskTitle,
        description: taskDesc,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Failed to add task");
      return;
    }

    const data = await res.json();
    setMessage(data.message);
    setTaskTitle("");
    setTaskDesc("");
    fetchTasks();
  } catch (error) {
    alert("❌ Server error while adding task");
  }
};


  return (
    <div className="container">
      <Sidebar />

      <main className="main">
        {/* ✅ Reusable Marquee */}
        <Marquee title="Your Tasks" username={username} />

        <div className="cards">
          <div className="card">
            <h3>📝 All Tasks</h3>

            {tasks.length ? (
              <ul>
                {tasks.map((task) => (
                  <li key={task._id}>
                    <strong
                      className={task.status === "completed" ? "completed" : ""}
                    >
                      {task.title}
                    </strong>
                    : {task.description || "No description"}

                    {task.status === "completed" && (
                      <span className="completed"> ✔ Completed</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks yet. Add some below 👇</p>
            )}
          </div>

          <div className="card">
            <h3>➕ Add Task</h3>

            <form onSubmit={addTask}>
              <input
                type="text"
                placeholder="Task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />

              <textarea
                placeholder="Task description"
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
              />

              <button type="submit">Add Task</button>
            </form>

            {message && <p className="success-msg">{message}</p>}
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Tasks;
