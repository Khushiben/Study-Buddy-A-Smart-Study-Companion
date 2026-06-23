import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "../styles/Flashcards.css"; // reuse card styles
import Marquee from "../components/Marquee";
import { mathematicsQuestions } from "../data/mathematicsQuestions";
import { lrQuestions } from "../data/lrQuestions";


const topics = [
  {
    id: "mathematics",
    title: "Learn Mathematics",
    description: "Practice number sense and arithmetic skills.",
    image: "/math.jpg",
  },
  {
    id: "logical-reasoning",
    title: "Learn Logical Reasoning",
    description: "Sharpen your problem solving and critical thinking.",
    image: "/lr.webp",
  },
];

const questionBank = {
  mathematics: mathematicsQuestions,
  "logical-reasoning": lrQuestions,
};

const LearningAptitude = () => {
  const navigate = useNavigate();
  const { topic, chapter } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const hasTopic = topic && questionBank[topic];
  const hasChapter = chapter && hasTopic && questionBank[topic].chapters[parseInt(chapter)];

  const handleStartTopic = (topicId) => {
    navigate(`/learning-aptitude/${topicId}`);
  };

  const handleStartChapter = (chapterIndex, topicId = topic) => {
    const targetTopic = topicId || "";
    if (!targetTopic || !questionBank[targetTopic]) {
      return navigate("/learning-aptitude");
    }
    navigate(`/learning-aptitude/${targetTopic}/${chapterIndex}`);
  };

  const topicData = hasTopic ? questionBank[topic] : null;

  if (topic && !questionBank[topic]) {
    return <Navigate to="/learning-aptitude" replace />;
  }

  const chapterData = hasChapter ? questionBank[topic].chapters[parseInt(chapter)] : null;
  const question = chapterData?.questions[currentIndex];

  const goNext = () => {
    if (!selectedOption) {
      alert("Please select an option to continue.");
      return;
    }

    if (selectedOption === question.correct) {
      setScore((s) => s + 1);
    }

    if (currentIndex < (chapterData?.questions.length || 0) - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption("");
    } else {
      setSubmitted(true);
    }
  };

  const retry = () => {
    setCurrentIndex(0);
    setSelectedOption("");
    setScore(0);
    setSubmitted(false);
  };

  return (
    <div className="container">
      <Sidebar activePage="Learning Aptitude" />

      <main className="main" style={{ paddingBottom: "40px" }}>
        <Marquee title="Welcome to learning Aptitude" />
        
        {!hasTopic && (
          <div style={{ paddingTop: "30px" }}>
            <b><h1 style={{ marginBottom: "30px" }}>Select a topic to begin:-</h1></b>
            <div className="cards" style={{ gap: "20px", paddingTop: "0" }}>
              {topics.map((t) => (
                <div key={t.id} className="card" style={{ maxWidth: "360px" }}>
                  <img
                    src={t.image}
                    alt={t.title}
                    style={{ width: "100%", borderRadius: "10px", height: "180px", objectFit: "cover" }}
                  />
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                  <button className="learning-aptitude-button" onClick={() => handleStartTopic(t.id)}>{t.title}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasTopic && !hasChapter && (
          <div style={{ paddingTop: "30px" }}>
            <b><h1 style={{ marginBottom: "30px" }}>Select a chapter for {topics.find(t => t.id === topic)?.title}:-</h1></b>
            <div className="cards" style={{ gap: "20px", paddingTop: "0" }}>
              {topicData.chapters.map((chap, index) => (
                <div key={index} className="card" style={{ maxWidth: "360px" }}>
                  <h3>{chap.name}</h3>
                  <p>{chap.questions.length} questions</p>
                  <button className="learning-aptitude-button" onClick={() => handleStartChapter(index, topic)}>Start Chapter</button>
                </div>
              ))}
            </div>
            <div className="learning-aptitude-actions">
              <button 
                className="learning-aptitude-back-btn"
                onClick={() => navigate("/learning-aptitude")}
              >
                Back to topics
              </button>
            </div>
          </div>
        )}

        {hasChapter && !submitted && question && (
          <div style={{ paddingTop: "30px" }}>
            <div className="card" style={{ margin: "0 auto", maxWidth: "650px", textAlign: "left" }}>
              <h2>{chapterData.name}</h2>
              {chapterData.shortcut && (
                <p className="learning-aptitude-shortcut" style={{ marginBottom: "14px", color: "#1d4ed8", fontWeight: 600 }}>
                  {chapterData.shortcut}
                </p>
              )}
              {question.shortcut && (
                <p className="learning-aptitude-shortcut" style={{ marginBottom: "14px", color: "#1d4ed8", fontWeight: 600 }}>
                  {question.shortcut}
                </p>
              )}
              <p>
                Question {currentIndex + 1} of {chapterData.questions.length}
              </p>
              <p style={{ fontSize: "1.25rem", fontWeight: "600" }}>{question.text}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {question.options.map((opt) => (
                  <button
                    key={opt}
                    className={`learning-aptitude-option ${selectedOption === opt ? "selected" : ""}`}
                    onClick={() => setSelectedOption(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                <button className="learning-aptitude-primary-btn" onClick={goNext}>
                  {currentIndex < chapterData.questions.length - 1 ? "Next" : "Submit"}
                </button>
                <button className="learning-aptitude-back-btn" onClick={() => navigate(`/learning-aptitude/${topic}`)}>Back to chapters</button>
              </div>
            </div>
          </div>
        )}

        {hasChapter && !submitted && !question && (
          <div style={{ paddingTop: "30px" }}>
            <div className="card" style={{ margin: "0 auto", maxWidth: "650px", textAlign: "center" }}>
              <h2>No questions available</h2>
              <p>Chapter data is missing or invalid. Please go back and refresh.</p>
              <button className="learning-aptitude-back-btn" onClick={() => navigate(`/learning-aptitude/${topic}`)}>
                Back to chapters
              </button>
            </div>
          </div>
        )}

        {hasChapter && submitted && (
          <div style={{ paddingTop: "30px" }}>
            <div className="card" style={{ margin: "0 auto", maxWidth: "600px", textAlign: "center" }}>
              <h2>Chapter Complete 🎉</h2>
              <p>{chapterData.name}</p>
              <h3>Score: {score} / {chapterData.questions.length}</h3>
              <p>{score === chapterData.questions.length ? "Excellent work!" : "Good job, keep practicing."}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                <button className="learning-aptitude-primary-btn" onClick={retry}>Retry</button>
                <button className="learning-aptitude-back-btn" onClick={() => navigate(`/learning-aptitude/${topic}`)}>Choose another chapter</button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
};

export default LearningAptitude;
