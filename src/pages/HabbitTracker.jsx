import React, { useState, useEffect } from "react";
import "../styles.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../locales/i18n";
import { getProgressPercentage } from "./HabitPage";

export const ProgressCircle = ({ progress, size = "100" }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = circumference * (1 - Math.min(progress, 100) / 100);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
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
        stroke={progress >= 100 ? "#4CAF50" : "#ff4d52"}
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={`${strokeDashoffset}`}
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
  const { t } = useTranslation();
  const [activityLatest, setActivityLatest] = useState([]);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const formatTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    return `${totalMinutes} ${t("min")}`;
  };

  useEffect(() => {
    const existingActivities =
      JSON.parse(localStorage.getItem("activities")) || [];
    setActivityLatest(existingActivities);

    const summary = [];

    existingActivities.forEach((activity) => {
      activity.history.forEach((entry) => {
        summary.push({
          date: entry.date,
          name: activity.name,
          time: entry.time,
          goal: entry.goal,
        });
      });
    });

    summary.sort((a, b) => {
      const timeA = new Date(`${a.date}T00:00:00Z`).getTime() + a.time * 1000;
      const timeB = new Date(`${b.date}T00:00:00Z`).getTime() + b.time * 1000;
      return timeB - timeA;
    });

    setTableData(summary);
  }, []);

  return (
    <div className="tracker">
      <h1>{t("title")}🦁</h1>
      <div className="activity-grid_oneCard">
        {activityLatest.map((data) => {
          return (
            <div
              className="activity-mainCard"
              key={data.id}
              onClick={() => navigate(`/${data.id}`)}
            >
              <h3 className="header-emoji">{data.emoji}</h3>
              <div>
                <h3>{data.name}</h3>
                <p>
                  {t("dailyGoal")}: {data.goal || 0} {t("min")}
                </p>
              </div>
              <button className="start-btn">{t("start")}</button>
            </div>
          );
        })}
      </div>

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
          {tableData.map((entry, index) => (
            <tr key={entry.id}>
              <td>{entry.date}</td>
              <td>{entry.name}</td>
              <td>{formatTime(entry.time)}</td>
              <td>
                <ProgressCircle
                  progress={getProgressPercentage(entry.goal, entry.time)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitTracker;
