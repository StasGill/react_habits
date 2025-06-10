import React, { useState, useEffect } from "react";
import "./styles.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n";
import Settings from "./Settings";
import BottomNav from "./BottomNav";

const ProgressCircle = ({ progress }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  // Корректный расчет смещения (нужно учитывать 100% как максимальный прогресс)
  const strokeDashoffset = circumference * (1 - Math.min(progress, 100) / 100);

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="#ddd"
        strokeWidth="8"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke={progress >= 100 ? "#4CAF50" : "#6200ee"}
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transition="stroke-dashoffset 0.5s ease-in-out"
      />
      <text x="50" y="55" textAnchor="middle" fontSize="16" fill="#333">
        {Math.round(Math.min(progress, 100))}%
      </text>
    </svg>
  );
};

const HabitTracker = () => {
  const { t, i18n } = useTranslation();
  const [activity, setActivity] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("habitHistory");
    return savedHistory ? JSON.parse(savedHistory) : {};
  });
  const [activities, setActivities] = useState(() => {
    const savedActivities = localStorage.getItem("habitActivities");
    return savedActivities
      ? JSON.parse(savedActivities)
      : ["Чтение", "Медитация", "Спорт"];
  });
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("habitGoals");
    return savedGoals ? JSON.parse(savedGoals) : {};
  });

  useEffect(() => {
    localStorage.setItem("habitHistory", JSON.stringify(history));
    localStorage.setItem("habitActivities", JSON.stringify(activities));
    localStorage.setItem("habitGoals", JSON.stringify(goals));
  }, [history, activities, goals]);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, startTime]);

  const formatTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    return `${totalMinutes} мин`;
  };

  const handleStart = () => {
    setTimerActive(true);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const handleStop = () => {
    setTimerActive(false);
    const today = new Date().toISOString().split("T")[0];

    const newHistory = { ...history };
    if (!newHistory[today]) {
      newHistory[today] = {};
    }
    newHistory[today][activity] =
      (newHistory[today][activity] || 0) + elapsedTime;

    setHistory(newHistory);
    setActivity("");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="tracker">
              <h1>{t("title")}🦁</h1>

              <select
                onChange={(e) => setActivity(e.target.value)}
                value={activity}
              >
                <option value="">{t("select")}</option>
                {activities.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>

              {timerActive ? (
                <button onClick={handleStop} className="stop-btn">
                  {t("stop")}
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="start-btn"
                  disabled={!activity}
                >
                  {t("start")}
                </button>
              )}

              {timerActive && (
                <p className="timer">
                  {t("time")}: {formatTime(elapsedTime)}
                </p>
              )}

              <h2>{t("dailyStats")}</h2>
              <table>
                <thead>
                  <tr>
                    <th>{t("date")}</th>
                    <th>{t("activity")}</th>
                    <th>{t("totalTime")}</th>
                    <th>{t("progress")}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(history).map(([date, activities]) =>
                    Object.entries(activities).map(([activity, duration]) => {
                      const goal = goals[activity] || 60;
                      const progress =
                        (Math.floor(duration / 60000) / goal) * 100;
                      return (
                        <tr key={`${date}-${activity}`}>
                          <td>{date}</td>
                          <td>{activity}</td>
                          <td>{formatTime(duration)}</td>
                          <td>
                            <ProgressCircle progress={progress} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          }
        />

        <Route
          path="/settings"
          element={
            <Settings
              setHistory={setHistory}
              activities={activities}
              setActivities={setActivities}
              goals={goals}
              setGoals={setGoals}
              i18n={i18n}
            />
          }
        />
      </Routes>

      <BottomNav />
    </Router>
  );
};

export default HabitTracker;
