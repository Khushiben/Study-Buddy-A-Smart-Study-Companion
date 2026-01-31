import React, { useEffect, useRef, useState } from "react";

const Timer = ({
  defaultMinutes = 25,
  onComplete,
  onManualComplete,
  onStart, // ✅ ADD THIS
}) => {
  const [inputMinutes, setInputMinutes] = useState("");
  const [time, setTime] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("pomodoro"); // "pomodoro" or "break"
  const [pomodoroTime, setPomodoroTime] = useState(defaultMinutes * 60);
  const [remainingPomodoroTime, setRemainingPomodoroTime] = useState(
    defaultMinutes * 60
  );

  const hasCompletedRef = useRef(false);
  const hasStartedRef = useRef(false); // ✅ track first start

  useEffect(() => {
    let interval;

    if (isRunning && time > 0) {
      interval = setInterval(() => setTime((prev) => prev - 1), 1000);
    }

    if (time === 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      setIsRunning(false);

      if (mode === "pomodoro") {
        onComplete && onComplete();
      } else if (mode === "break") {
        setMode("pomodoro");
        setTime(remainingPomodoroTime);
        setIsRunning(true);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, time, mode, onComplete, remainingPomodoroTime]);

  const startTimer = () => {
    if (!isRunning) {
      // ✅ Notify parent ONLY the first time timer starts
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        onStart && onStart();
      }

      if (time === 0 || mode === "pomodoro") {
        const minutes = inputMinutes
          ? parseInt(inputMinutes)
          : defaultMinutes;
        setTime(minutes * 60);
        setPomodoroTime(minutes * 60);
        setRemainingPomodoroTime(minutes * 60);
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
    setTime(5 * 60);
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

    if (mode === "pomodoro") {
      setIsRunning(false);
      const minutes = inputMinutes
        ? parseInt(inputMinutes)
        : defaultMinutes;
      setTime(minutes * 60);
      setPomodoroTime(minutes * 60);
      setRemainingPomodoroTime(minutes * 60);
    } else if (mode === "break") {
      setIsRunning(false);
      setTime(5 * 60);
    }
  };

  const minutesDisplay = Math.floor(time / 60);
  const secondsDisplay = time % 60;

  return (
    <div className="timer-box">
      <h4>🍅 {mode === "pomodoro" ? "Pomodoro" : "Break"}</h4>

      <input
        type="number"
        placeholder="Minutes (default 25)"
        value={inputMinutes}
        onChange={(e) => setInputMinutes(e.target.value)}
        className="timer-input"
        disabled={isRunning && mode === "pomodoro"}
      />

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
