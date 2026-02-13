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

  // which timer UI is open
  const [activeTimerTaskId, setActiveTimerTaskId] = useState(null);

  // which task timer is running OR paused
  const [runningTaskId, setRunningTaskId] = useState(null);

  const token = localStorage.getItem("token");

  const completedTasksRef = useRef(new Set());
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
      headers: { Authorization: `Bearer ${token}` },
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
    if (!timerStartedRef.current[taskId]) {
      alert("⏱️ Please start the timer first!");
      return;
    }

    const isConfirmed = window.confirm(
      `Are you sure you want to mark "${title}" as completed?`
    );
    if (!isConfirmed) return;

    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "completed" }),
      });

      alert(`🎉 Task "${title}" completed!`);
      setRunningTaskId(null);
      setActiveTimerTaskId(null);
      fetchTasks();
    } catch {
      alert("❌ Failed to complete task");
    }
  };

  // 🔥 SMART DELETE LOGIC (ONLY CHANGE)
  const deleteAllTasks = async () => {
    if (tasks.length === 0) {
      alert("No tasks to delete!");
      return;
    }

    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    );
    const pendingTasks = tasks.filter(
      (task) => task.status !== "completed"
    );

    try {
      // ✅ All tasks completed → delete directly
      if (pendingTasks.length === 0) {
        const confirmDelete = window.confirm(
          "🗑️ All tasks are completed.\nDo you want to delete all of them?"
        );
        if (!confirmDelete) return;

        await fetch("http://localhost:5000/api/tasks", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // ⚠️ Mixed tasks
        const deleteAll = window.confirm(
          "⚠️ You have unfinished tasks.\n\n" +
            "OK → Delete ALL tasks\n" +
            "Cancel → Delete ONLY completed tasks"
        );

        if (deleteAll) {
          await fetch("http://localhost:5000/api/tasks", {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await Promise.all(
            completedTasks.map((task) =>
              fetch(`http://localhost:5000/api/tasks/${task._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              })
            )
          );
        }
      }

      setRunningTaskId(null);
      setActiveTimerTaskId(null);
      fetchTasks();
    } catch {
      alert("❌ Failed to delete tasks");
    }
  };

  const handleTimerIconClick = (taskId) => {
    if (runningTaskId && runningTaskId !== taskId) {
      alert("⏳ Please complete the current task first!");
      return;
    }

    setActiveTimerTaskId(
      activeTimerTaskId === taskId ? null : taskId
    );
  };

  return (
    <div className="container">
      <Sidebar activePage="Tasks" />

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
                      :-{task.description || "No description"}
                    </span>

                    {task.status === "completed" ? (
                      <span className="completed status">✔ Completed</span>
                    ) : (
                      <>
                        <button
                          className={`timer-toggle-btn ${
                            runningTaskId &&
                            runningTaskId !== task._id
                              ? "disabled"
                              : ""
                          }`}
                          onClick={() =>
                            handleTimerIconClick(task._id)
                          }
                        >
                          ⏱️
                        </button>

                        {activeTimerTaskId === task._id && (
                          <div className="task-timers">
                            <Timer
                              defaultMinutes={25}
                              isActive={runningTaskId === task._id}
                              onStart={() => {
                                timerStartedRef.current[task._id] = true;
                                setRunningTaskId(task._id);
                              }}
                              onStop={() => {
                                setRunningTaskId(task._id);
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
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {tasks.length === 0 && (
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
