import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "../styles/Flashcards.css";
import Marquee from "../components/Marquee";
import axios from "axios";

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [subjectType, setSubjectType] = useState("General"); // General | Other
  const [customSubject, setCustomSubject] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const [subjects, setSubjects] = useState([]); // 🔥 ALL subjects (fixed)
  const [username, setUsername] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
    fetchFlashcards();
  }, [token, selectedSubject]);

  const fetchUser = () => {
    axios
      .get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsername(res.data.name))
      .catch(() => setUsername("User"));
  };

  const fetchFlashcards = async () => {
    // 🚀 Always fetch ALL flashcards
    const res = await fetch("http://localhost:5000/api/flashcards", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const allCards = data.flashcards || [];

    // ✅ build subject list from ALL cards (not filtered)
    const uniqueSubjects = [...new Set(allCards.map((c) => c.subject))];
    setSubjects(uniqueSubjects);

    // ✅ apply filter locally
    if (selectedSubject === "All") {
      setFlashcards(allCards);
    } else {
      setFlashcards(
        allCards.filter((c) => c.subject === selectedSubject)
      );
    }
  };

  const handleAddFlashcard = async (e) => {
    e.preventDefault();
    if (!question || !answer) return;

    const finalSubject =
      subjectType === "General" ? "General" : customSubject.trim();

    if (!finalSubject) {
      alert("Please enter a subject name");
      return;
    }

    const res = await fetch("http://localhost:5000/api/flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question,
        answer,
        subject: finalSubject,
      }),
    });

    if (res.ok) {
      const newCard = await res.json();

      // ✅ add card to list
      setFlashcards((prev) => [...prev, newCard]);

      // ✅ ensure subject exists in filter list
      if (!subjects.includes(finalSubject)) {
        setSubjects((prev) => [...prev, finalSubject]);
      }

      setQuestion("");
      setAnswer("");
      setCustomSubject("");
      setSubjectType("General");
      alert("✅ Flashcard added!");
    }
  };

  return (
    <div className="flashcards-page">
      <Sidebar active="flashcards" />

      <main className="main">
        <Marquee title="Your Flashcards" username={username} />

        <div className="cards">
          {/* ➕ ADD FLASHCARD */}
          <div className="card auth-container">
            <h2>Add Flashcard</h2>
            <form onSubmit={handleAddFlashcard}>
              <input
                type="text"
                placeholder="Question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />

              <select
                value={subjectType}
                onChange={(e) => setSubjectType(e.target.value)}
                className="dropdown"
              >
                <option value="General">General</option>
                <option value="Other">Other</option>
              </select>

              {subjectType === "Other" && (
                <input
                  type="text"
                  placeholder="Enter subject name"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  required
                />
              )}

              <button type="submit">Add</button>
            </form>
          </div>

          {/* 📂 FLASHCARDS */}
          <div className="card">
            <h2>Flashcards</h2>

            <div className="filter-bar">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="dropdown"
              >
                <option value="All">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div className="flashcard-container">
              {flashcards.map((card) => (
                <div
                  className="flashcard"
                  key={card._id}
                  onClick={(e) =>
                    e.currentTarget.classList.toggle("flipped")
                  }
                >
                  <div className="flashcard-inner">
                    <div className="flashcard-front">
                      {card.question}
                    </div>
                    <div className="flashcard-back">
                      {card.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Flashcards;
