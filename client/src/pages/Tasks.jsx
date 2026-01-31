import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import Timer from "../components/Timer";
import "../styles/Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  const token = localStorage.getItem("token");

  // ✅ prevents multiple completion calls per task
  const completedTasksRef = useRef(new Set());

  // ✅ track if timer was started for each task
  const timerStartedRef = useRef({});

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
    } catch {
      alert("❌ Server error while adding task");
    }
  };

  const markCompleted = async (taskId, title) => {
    // ❌ Timer never started
    if (!timerStartedRef.current[taskId]) {
      alert("⏱️ Please start the timer before marking the task as completed!");
      return;
    }

    // ✅ already completed → do nothing
    if (completedTasksRef.current.has(taskId)) return;

    const isConfirmed = window.confirm(
      `Are you sure you want to mark "${title}" as completed?`
    );

    if (!isConfirmed) return;

    completedTasksRef.current.add(taskId);

    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "completed" }),
        }
      );

      if (!res.ok) throw new Error();

      alert(`🎉 Task "${title}" completed!`);
      fetchTasks();
    } catch {
      completedTasksRef.current.delete(taskId);
      alert("❌ Failed to mark task as completed");
    }
  };

  const deleteAllTasks = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete all tasks?"
    );

    if (!isConfirmed) return;

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      alert("🗑️ All tasks deleted!");
      fetchTasks();
    } catch {
      alert("❌ Failed to delete tasks");
    }
  };

  return (
    <div className="container">
      <Sidebar />

      <main className="main">
        <Marquee title="Your Tasks" username={username} />

        <div className="cards">
          <div className="card">
            <div className="card-header">
              <h3>📝 All Tasks</h3>
              <button
                className="delete-history-btn"
                title="Clear Task History"
                onClick={deleteAllTasks}
              >
                🗑️
              </button>
            </div>

            {tasks.length ? (
              <ul className="task-list">
                {tasks.map((task) => (
                  <li key={task._id} className="task-item">
                    <div className="task-row">
                      <strong
                        className={
                          task.status === "completed" ? "completed" : ""
                        }
                      >
                        {task.title}
                      </strong>

                      <span className="task-desc">
                        {task.description || "No description"}
                      </span>

                      {task.status === "completed" ? (
                        <span className="completed status">✔ Completed</span>
                      ) : (
                        <div className="task-timers">
                          <Timer
                            defaultMinutes={25}
                            onStart={() => {
                              timerStartedRef.current[task._id] = true;
                            }}
                            onComplete={() =>
                              markCompleted(task._id, task.title)
                            }
                            onManualComplete={() =>
                              markCompleted(task._id, task.title)
                            }
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks yet. Add some from here 👉 </p>
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
