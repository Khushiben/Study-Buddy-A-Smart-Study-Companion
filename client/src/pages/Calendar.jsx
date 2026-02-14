import { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import ProtectedRoute from "../components/ProtectedRoute";

import "../styles/Calendar.css";

const Calendar = () => {
  const [deadlines, setDeadlines] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [success, setSuccess] = useState(false);
  const [username, setUsername] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadlineDate: ""
  });


  const token = localStorage.getItem("token");
  const fetchUser = async () => {
  try {
    // Add the full localhost URL here
    const res = await axios.get("http://localhost:5000/api/user", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsername(res.data.name);
  } catch (err) {
    console.error("Fetch User Error:", err);
    setUsername("User");
  }
};
useEffect(() => {
  if (!token) return;

  fetchUser();
  fetchDeadlines();
  fetchUpcoming();
}, [token]);



  /* ---------------- FETCH ALL DEADLINES ---------------- */
const fetchDeadlines = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/deadlines", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setDeadlines(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Error fetching deadlines:", err);
  }
};

  /* ---------------- FETCH UPCOMING DEADLINES ---------------- */
const fetchUpcoming = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/deadlines/upcoming", {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Check if the response is valid before parsing
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();
    
    // Ensure data is an array so .map() doesn't crash the UI
    setUpcoming(Array.isArray(data) ? data : []);
    
  } catch (err) {
    console.error("Error fetching upcoming deadlines:", err);
    setUpcoming([]); // Set to empty array on error to prevent UI break
  }
};
  /* ---------------- ADD DEADLINE ---------------- */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!token) {
    alert("You are not logged in!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/deadlines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    // Check if response is actually JSON before parsing
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new TypeError("Oops, we didn't get JSON back from the server!");
    }

    const data = await res.json();

    if (res.ok) { // res.ok checks for status 200-299
      setSuccess(true);
      setForm({ title: "", description: "", deadlineDate: "" });
      fetchDeadlines();
      fetchUpcoming();
      setTimeout(() => setSuccess(false), 2000);
    } else {
      alert(data.message || "Error adding deadline");
    }
  } catch (err) {
    console.error("Submit error:", err);
    alert("Server connection failed. Is your backend running on port 5000?");
  }
};

/* ---------------- CALENDAR EVENTS ---------------- */
// Add "deadlines &&" to ensure the code only runs if deadlines exists
const calendarEvents = (deadlines || []).map(d => {
  // Check if d exists before accessing its properties
  if (!d) return {}; 

  return {
    id: d._id || d.id, // Handles both MongoDB _id and fallback
    title: d.title || "Untitled",
    start: d.deadlineDate || d.start,
    extendedProps: {
      description: d.description || ""
    }
  };
});
  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        <Sidebar activePage="Calendar" />

        <main className="main-content">
          

          <div className="calendar-page">
            <Marquee title="Your Deadlines" username={username} />
          {/* ===== TWO COLUMN LAYOUT ===== */}
            <div className="calendar-grid">

              {/* -------- ADD DEADLINE FORM -------- */}
              <div className="card">
                <h3>➕ Add Deadline</h3>

                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Deadline title"
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />

                  <textarea
                    placeholder="Description (optional)"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />

                  <input
                    type="date"
                    required
                    value={form.deadlineDate}
                    onChange={(e) =>
                      setForm({ ...form, deadlineDate: e.target.value })
                    }
                  />

                  <button type="submit">Add Deadline</button>
                </form>
                {success && (
                <p style={{ color: "green", marginBottom: "10px" }}>
                ✅ Deadline added!
                </p>
            )}
              </div>
              

              {/* -------- CALENDAR -------- */}
              <div className="card">
                <h3>📅 Deadline Calendar</h3>

                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin]}
                  initialView="dayGridMonth"
                  height="auto"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay"
                  }}
                  events={calendarEvents}
                  displayEventTime={false}
                  eventDidMount={(info) => {
                    if (info.event.extendedProps.description) {
                      info.el.title =
                        info.event.extendedProps.description;
                    }
                  }}
                />
              </div>

            </div>

            {/* -------- UPCOMING DEADLINES -------- */}
            <div className="card" style={{ marginTop: "20px" }}>
              <h3>📌 Upcoming Deadlines This Week</h3>
              <ul>
                {upcoming.length === 0 && (
                  <li>No upcoming deadlines this week.</li>
                )}
                {upcoming.map(d => (
                  <li key={d._id}>
                    {d.title} –{" "}
                    {new Date(d.deadlineDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
            <Footer />
          </div>

          
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Calendar;
