import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "../styles/Home.css";

function Home() {
  return (
    <>
      {/* Floating icons */}
      <div className="floating-icons">
        <span className="icon">📚</span>
        <span className="icon">💻</span>
        <span className="icon">📝</span>
        <span className="icon">🎓</span>
        <span className="icon">🖊️</span>
        <span className="icon">📖</span>
      </div>

      <div className="home-container">
        <header>
          <marquee
            behavior="scroll"
            direction="left"
            scrollAmount="10"
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#1e40af",
              backgroundColor: "#ffe4e1",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <u>
              🌟 Welcome to Study Buddy — Organize Tasks, Notes, Flashcards &
              Boost Your Productivity! 🚀📚
            </u>
          </marquee>

          <h2 className="fade-in delay-1" style={{ textAlign: "center" }}>
            Your personal study companion to organize tasks, notes, and
            flashcards efficiently!!!
          </h2>
        </header>

        <div className="home-content">
          <div className="home-card fade-in delay-2">
            <h2>Organize Your Tasks</h2>
            <p>
              Keep track of your daily study tasks, timers, and progress all in
              one place.
            </p>
          </div>

          <div className="home-card fade-in delay-3">
            <h2>Flashcards & Notes</h2>
            <p>
              Learn efficiently using interactive flashcards and save important
              notes for quick reference.
            </p>
          </div>

          <div className="home-card fade-in delay-4">
            <h2>Smart Calendar & Reminders</h2>
            <p>
              Stay on top of your deadlines with the built-in calendar! Add
              important submission dates, project deadlines, or personal goals —
              and get daily reminders to keep your studies on track.
            </p>
          </div>
        </div>

        <div
          className="home-card fade-in delay-5"
          style={{
            background: "linear-gradient(135deg, #f6df86ff, #f78fd3ff)",
            color: "#fff",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          }}
        >
          <h2>🌟 Why Study Buddy?</h2>
          <p style={{ fontSize: "18px" }}>
            Study Buddy helps students manage time, stay organized, and
            collaborate with peers — all in one platform! Boost productivity and
            achieve your study goals.
          </p>
        </div>

        <div className="get-started fade-in delay-5" style={{ textAlign: "center" }}>
          <a href="/signup" className="btn-get-started">
            Get Started 🚀
          </a>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
