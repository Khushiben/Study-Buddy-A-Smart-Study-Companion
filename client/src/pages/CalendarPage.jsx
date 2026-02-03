import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Modal from "../components/Modal"; // optional if editing deadlines
import axios from "axios";
import "../styles/calendar.css"; // your existing calendar CSS

const CalendarPage = ({ username }) => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", deadline_date: "" });
  const [successMsg, setSuccessMsg] = useState(false);
  const [upcoming, setUpcoming] = useState([]);

  // Fetch all deadlines
  const fetchDeadlines = async () => {
    try {
      const res = await axios.get("/api/deadlines", { withCredentials: true });
      setEvents(res.data);
      filterUpcoming(res.data);
    } catch (err) {
      console.error("Error fetching deadlines:", err);
    }
  };

  // Filter upcoming deadlines within a week
  const filterUpcoming = (eventsList) => {
    const today = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(today.getDate() + 7);

    const upcomingEvents = eventsList.filter((ev) => {
      const evDate = new Date(ev.start);
      return evDate >= today && evDate <= weekFromNow;
    });
    setUpcoming(upcomingEvents);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.deadline_date) return;

    try {
      await axios.post("/api/deadlines", formData, { withCredentials: true });
      setSuccessMsg(true);
      setFormData({ title: "", description: "", deadline_date: "" });
      fetchDeadlines();
      setTimeout(() => setSuccessMsg(false), 2000);
    } catch (err) {
      alert(err.response?.data?.error || "Error adding deadline");
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

  return (
    <div className="container">
      <Sidebar active="calendar" />

      <main className="main">
        <marquee behavior="scroll" direction="left" scrollamount="10">
          <h2>Your Deadlines, {username} 👋</h2>
        </marquee>

        <div className="cards">
          {/* Add Deadline Form */}
          <div className="card">
            <h3>➕ Add Deadline</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Deadline title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="date"
                value={formData.deadline_date}
                onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })}
                required
              />
              <button type="submit">Add Deadline</button>
              {successMsg && <p className="success-msg">✅ Deadline added!</p>}
            </form>
          </div>

          {/* Calendar */}
          <div className="card">
            <h3>📅 Deadline Calendar</h3>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              eventColor="#28a745"
              eventContent={(info) => (
                <div title={info.event.extendedProps.description}>{info.event.title}</div>
              )}
              height="auto"
            />
          </div>
        </div>

        {/* Upcoming Deadlines This Week */}
        <div className="upcoming">
          <h3>📌 Upcoming Deadlines This Week</h3>
          <ul>
            {upcoming.length
              ? upcoming.map((ev) => (
                  <li key={ev.id}>
                    {ev.title} - {new Date(ev.start).toLocaleDateString()}
                  </li>
                ))
              : <li>No upcoming deadlines this week.</li>}
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalendarPage;
