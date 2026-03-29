import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Marquee from "../components/Marquee";
import Footer from "../components/Footer";
import "../styles/Profile.css";
{/*npm install recharts*/}
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

function Profile() {

  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/user", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data));

    fetch("http://localhost:5000/api/progress", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProgress(data));

  }, []);

  return (
    <div className="app-container">

      <Sidebar />

      <div className="main-content">

      <div className="profile-container">
        <Marquee title="Your Profile" username={user?.name} />

        

          <h2>👤 Profile</h2>

          {user ? (
            <div className="profile-card">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}

          {progress && (
            <>
              <div className="progress-section">
                <h2>📊 Study Progress</h2>

                <div className="progress-grid">

                  <div className="progress-card">
                    <h3>✅ Tasks</h3>
                    <p>{progress.completedTasks} / {progress.totalTasks}</p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress.taskProgress}%` }}
                      />
                    </div>
                    <span>{progress.taskProgress}% Completed</span>
                  </div>

                  <div className="progress-card">
                    <h3>📚 Flashcards</h3>
                    <p>{progress.flashcards} cards created</p>
                  </div>

                  <div className="progress-card">
                    <h3>📝 Notes</h3>
                    <p>{progress.notes} notes uploaded</p>
                  </div>

                  <div className="progress-card">
                    <h3>⏰ Deadlines</h3>
                    <p>{progress.deadlines} upcoming</p>
                  </div>

                  <div className="progress-card productivity">
                    <h3>🔥 Productivity Score</h3>
                    <p>{progress.productivityScore}%</p>
                  </div>

                </div>
              </div>

              {/* GRAPH */}
              <div className="graph-section">
                <h2>📈 Activity Overview</h2>

                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={[
                      { name: "Weekly", tasks: progress.weeklyTasks },
                      { name: "Monthly", tasks: progress.monthlyTasks },
                      { name: "Yearly", tasks: progress.yearlyTasks }
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasks" stroke="#5b86e5" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

        </div>

        <Footer />

      </div>
    </div>
  );
}

export default Profile;