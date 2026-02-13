import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import "../styles/Notes.css";

const Notes = () => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [username, setUsername] = useState("");
  // removed recentSubject; no longer needed


  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
    fetchNotes();
  }, [token, selectedSubject]);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(res.data.name);
    } catch {
      setUsername("User");
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allNotes = res.data;
      setNotes(allNotes);

      const unique = [...new Set(allNotes.map((n) => n.subject))];
      setSubjects(unique);
    } catch {
      alert("❌ Failed to fetch notes");
    }
  };

  const deleteAllNotes = async () => {
    if (notes.length === 0) {
      alert("No notes to delete!");
      return;
    }
    const confirmed = window.confirm(
      "🗑️ Are you sure you want to delete ALL notes?"
    );
    if (!confirmed) return;

    try {
      await fetch("http://localhost:5000/api/notes", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes([]);
      setSubjects([]);
    } catch {
      alert("❌ Failed to delete notes");
    }
  };

  const handleDownload = async (note) => {
    try {
      const res = await fetch(`http://localhost:5000${note.fileUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = note.fileName || "file";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("❌ Unable to download file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      alert("⚠ Subject is required");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("content", content);
    if (file) formData.append("noteFile", file);

    try {
      await axios.post(
        "http://localhost:5000/api/notes",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubject("");
      setContent("");
      setFile(null);
      fetchNotes();
    } catch {
      alert("❌ Failed to save note");
    }
  };

  // Apply filter then group by subject
  const filteredNotes =
    selectedSubject.toLowerCase() === "all"
      ? notes
      : notes.filter(
          (n) => n.subject.toLowerCase() === selectedSubject.toLowerCase()
        );

  const groupedNotes = filteredNotes.reduce((acc, note) => {
    acc[note.subject] = acc[note.subject] || [];
    acc[note.subject].push(note);
    return acc;
  }, {});

  return (
    <div className="container">
      <Sidebar activePage="Notes" />

      <main className="main">
        <Marquee title="Your Notes" username={username} />

        <div className="cards">
            {/* Notes List */}
          <div className="card">
            <div className="filter-bar">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="dropdown"
              >
                <option value="All">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="card-header">
              <h3>📂 Subject-wise Notes</h3>
              <button
                className="delete-history-btn"
                title="Clear Notes"
                onClick={deleteAllNotes}
              >
                🗑️
              </button>
            </div>

            {Object.keys(groupedNotes).length === 0 && (
              <p>No notes yet. Add one here 👉</p>
            )}

            {Object.keys(groupedNotes).map((subj) => (
              <div key={subj} className="subject-section">
                <h4 className="subject-title">📘 {subj}</h4>
            {groupedNotes[subj].map((note) => (
                  <div key={note._id} className="note-card">
                    {note.content && <p>{note.content}</p>}

                    {note.fileUrl && (
                      <div className="file-actions">
                        <a
                          href={`http://localhost:5000${note.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          👁 View
                        </a>

                        <button
                          className="download-btn"
                          onClick={() => handleDownload(note)}
                        >
                          ⬇ Download
                        </button>
                        <div className="subject-actions">
              <a
                className="download-btn"
                href="/flashcards"
              >
                ➕ Add flashcard for {subj}
              </a>
              <a
                className="download-btn"
                href={`/flashcards?subject=${encodeURIComponent(subj)}`}
              >
                👁 View flashcards
              </a>
            </div>
                      </div>
                      
                    )}

                    <small>
                      {new Date(note.createdAt).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Add Note */}
          <div className="card">
            <h3>➕ Add Note</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Subject (e.g., DBMS)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <textarea
                placeholder="Write your note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button type="submit">Save Note</button>
            </form>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Notes;