import React, { useEffect, useRef, useState } from "react";
{/*CSS OF TIMER IN Tasks.css*/}

const Timer = ({
  defaultMinutes = 25,
  onComplete,
  onManualComplete,
  onStart,
}) => {
  const [timerType, setTimerType] = useState("pomodoro"); // pomodoro | custom
  const [customWorkMinutes, setCustomWorkMinutes] = useState("");
  const [customBreakMinutes, setCustomBreakMinutes] = useState("");

  const [time, setTime] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // pomodoro | break
  const [pomodoroTime, setPomodoroTime] = useState(defaultMinutes * 60);
  const [remainingPomodoroTime, setRemainingPomodoroTime] = useState(
    defaultMinutes * 60
  );

  const hasCompletedRef = useRef(false);
  const hasStartedRef = useRef(false);

  // ⏱ Correct timings
  const WORK_MINUTES =
    timerType === "pomodoro"
      ? defaultMinutes
      : customWorkMinutes
      ? parseInt(customWorkMinutes)
      : defaultMinutes;

  const BREAK_MINUTES =
    timerType === "pomodoro"
      ? 5
      : customBreakMinutes
      ? parseInt(customBreakMinutes)
      : 5;

  useEffect(() => {
    let interval;

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    if (time === 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setIsRunning(false);

      if (mode === "pomodoro") {
        onComplete && onComplete();
      } else {
        setMode("pomodoro");
        setTime(remainingPomodoroTime);
        setIsRunning(true);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, time, mode, onComplete, remainingPomodoroTime]);

  // ▶️ Start / Resume
  const startTimer = () => {
    if (!isRunning) {
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        onStart && onStart();

        // Initialize ONLY on first start
        setTime(WORK_MINUTES * 60);
        setPomodoroTime(WORK_MINUTES * 60);
        setRemainingPomodoroTime(WORK_MINUTES * 60);
      }

      hasCompletedRef.current = false;
      setIsRunning(true);
    }
  };

  const startBreak = () => {
    if (mode === "pomodoro") {
      setRemainingPomodoroTime(time);
    }
    hasCompletedRef.current = false;
    setMode("break");
    setTime(BREAK_MINUTES * 60);
    setIsRunning(true);
  };

  const returnToPomodoro = () => {
    hasCompletedRef.current = false;
    setMode("pomodoro");
    setTime(remainingPomodoroTime);
    setIsRunning(true);
  };

  const resetTimer = () => {
    hasCompletedRef.current = false;
    hasStartedRef.current = false; // allow fresh start
    setIsRunning(false);
    setMode("pomodoro");
    setTime(WORK_MINUTES * 60);
  };

  const minutesDisplay = Math.floor(time / 60);
  const secondsDisplay = time % 60;

  return (
    <div className="timer-box">
      
<div className="timer-type">
  <label className={`radio-card ${timerType === "pomodoro" ? "active" : ""}`}>
    <input
      type="radio"
      checked={timerType === "pomodoro"}
      onChange={() => setTimerType("pomodoro")}
      disabled={isRunning}
    />
    <span>🍅 Pomodoro</span>
    <small>25 min work • 5 min break</small>
  </label>

  <label className={`radio-card ${timerType === "custom" ? "active" : ""}`}>
    <input
      type="radio"
      checked={timerType === "custom"}
      onChange={() => setTimerType("custom")}
      disabled={isRunning}
    />
    <span>⚙️ Custom</span>
    <small>Set your own time</small>
  </label>
</div>

      {/* Custom inputs ONLY for custom mode */}
      {timerType === "custom" && (
        <>
          <input
            type="number"
            placeholder="Work minutes default 25 min"
            value={customWorkMinutes}
            onChange={(e) => setCustomWorkMinutes(e.target.value)}
            className="timer-input"
            disabled={isRunning}
          />

          <input
            type="number"
            placeholder="Break minutes default 5 min"
            value={customBreakMinutes}
            onChange={(e) => setCustomBreakMinutes(e.target.value)}
            className="timer-input"
            disabled={isRunning}
          />
        </>
      )}
      <h2>
        {minutesDisplay}:{secondsDisplay.toString().padStart(2, "0")}
      </h2>

      <div className="timer-buttons-inline">
        {!isRunning ? (
          <button onClick={startTimer}>▶ Start</button>
        ) : (
          <button onClick={() => setIsRunning(false)}>⏸ Pause</button>
        )}

        <button onClick={resetTimer}>🔄 Reset</button>

        {mode === "pomodoro" && isRunning && (
          <button onClick={startBreak}>☕ Take Break</button>
        )}

        {mode === "break" && (
          <button onClick={returnToPomodoro}>
            ⏮ Return to Pomodoro
          </button>
        )}

        {mode === "pomodoro" && onManualComplete && (
          <button
            className="complete-btn inline"
            onClick={onManualComplete}
          >
            ✅ Mark Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
