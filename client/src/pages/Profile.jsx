import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Marquee from "../components/Marquee";
import Footer from "../components/Footer";
import "../styles/Profile.css";

function Profile() {

  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    // Fetch user info
    fetch("http://localhost:5000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUser(data));

    // Fetch progress stats
    fetch("http://localhost:5000/api/progress", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setProgress(data));

  }, []);

  return (

    <div className="app-container">

      {/* Sidebar */}
      <Sidebar />

      <div className="main-content">

        {/* Top Banner */}
        <Marquee title="Your Profile" username={user?.name} />

        <div className="profile-container">

          <h2>👤 Profile</h2>

          {/* User Card */}
          {user ? (
            <div className="profile-card">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}

          {/* Progress Section */}
          {progress && (
            <div className="progress-section">

              <h2>📊 Study Progress</h2>

              <div className="progress-grid">

                {/* Tasks */}
                <div className="progress-card">
                  <h3>✅ Tasks</h3>
                  <p>{progress.completedTasks} / {progress.totalTasks}</p>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress.taskProgress}%` }}
                    ></div>
                  </div>

                  <span>{progress.taskProgress}% Completed</span>
                </div>

                {/* Flashcards */}
                <div className="progress-card">
                  <h3>📚 Flashcards</h3>
                  <p>{progress.flashcards} cards created</p>
                </div>

                {/* Notes */}
                <div className="progress-card">
                  <h3>📝 Notes</h3>
                  <p>{progress.notes} notes uploaded</p>
                </div>

                {/* Deadlines */}
                <div className="progress-card">
                  <h3>⏰ Deadlines</h3>
                  <p>{progress.deadlines} upcoming</p>
                </div>

                {/* Productivity Score */}
                <div className="progress-card productivity">
                  <h3>🔥 Productivity Score</h3>
                  <p>{progress.productivityScore}%</p>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <Footer />

      </div>

    </div>
  );
}

export default Profile;