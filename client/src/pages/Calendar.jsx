import { useEffect, useState } from "react";
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

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadlineDate: ""
  });

  const token = localStorage.getItem("token");

  /* ---------------- FETCH ALL DEADLINES ---------------- */
  const fetchDeadlines = async () => {
    const res = await fetch("/api/deadlines", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setDeadlines(data);
  };

  /* ---------------- FETCH UPCOMING DEADLINES ---------------- */
  const fetchUpcoming = async () => {
    const res = await fetch("/api/deadlines/upcoming", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUpcoming(data);
  };

  /* ---------------- ADD DEADLINE ---------------- */
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!token) {
    alert("You are not logged in!");
    return;
  }

  try {
    console.log("Submitting form:", form); // debug
    const res = await fetch("/api/deadlines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    console.log("Backend response:", data);

    if (data.status === "success") {
      setSuccess(true);
      setForm({ title: "", description: "", deadlineDate: "" });
      fetchDeadlines();
      fetchUpcoming();
      setTimeout(() => setSuccess(false), 2000);
    } else {
      alert(data.message || "Error adding deadline");
    }
  } catch (err) {
    console.error("Error adding deadline:", err);
    alert("Failed to add deadline. Check console for details.");
  }
};

  /* ---------------- CALENDAR EVENTS ---------------- */
  const calendarEvents = deadlines.map(d => ({
    id: d.id,
    title: d.title,
    start: d.start || d.deadlineDate,
    description: d.description
  }));

  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        <Sidebar />

        <main className="main-content">
          <Marquee text="📅 Track your deadlines and stay ahead with Study Buddy!" />

          <div className="calendar-page">
            <h2>Your Deadlines 👋</h2>

            {success && (
              <p style={{ color: "green", marginBottom: "10px" }}>
                ✅ Deadline added!
              </p>
            )}

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

          </div>

          <Footer />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Calendar;
