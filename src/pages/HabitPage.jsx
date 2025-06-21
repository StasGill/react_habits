import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./habitPage.scss";
import { useParams } from "react-router-dom";
import { ProgressCircle } from "./HabbitTracker";
import { v4 as uuidv4 } from "uuid";

export function getProgressPercentage(minutesGoal, millisecondsSpent) {
  const totalMilliseconds = minutesGoal * 60 * 1000;
  const progress = (millisecondsSpent / totalMilliseconds) * 100;
  return Math.min(progress, 100).toFixed(2);
}

function HabitPage() {
  const { t } = useTranslation();
  const [habit, setHabit] = useState({});
  const [habitDailyTime, setHabitDailyTime] = useState(0);
  const [activityLatest, setActivityLatest] = useState([]);
  const [timerActive, setTimerActive] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [elapsedTime, setElapsedTime] = useState(0);
  const { id } = useParams();

  const intervalRef = useRef(null);

  const handleStart = () => {
    let timeStarted = Date.now();
    let innerFunctionTime = habitDailyTime;
    setTimerActive(true);

    intervalRef.current = setInterval(() => {
      setElapsedTime(Date.now() - timeStarted);
      innerFunctionTime = innerFunctionTime + 1000;
      setHabitDailyTime(innerFunctionTime);
    }, 1000);
  };

  function updateOrAddTodayTime(array, addedTime) {
    const found = array.find((obj) => obj.date === today);
    if (found) {
      found.time += addedTime;
    } else {
      const newObject = {
        date: today,
        name: habit.name,
        id: uuidv4(),
        time: addedTime,
        goal: habit.goal,
      };
      array.push(newObject);
    }

    return array;
  }

  const handleStop = () => {
    setTimerActive(false);
    const updatedHabit = { ...habit, timerStarted: null };
    setHabit(updatedHabit);

    const updatedActivities = activityLatest.map((activity) => {
      if (activity.id === id) {
        const updatedArray = updateOrAddTodayTime(
          activity.history,
          elapsedTime
        );
        return { ...activity, history: updatedArray };
      } else {
        return activity;
      }
    });
    setActivityLatest(updatedActivities);
    localStorage.setItem("activities", JSON.stringify(updatedActivities));
    clearInterval(intervalRef.current);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours} ${t("h")} ${minutes} ${t("m")} ${seconds} ${t("s")}`;
  };

  useEffect(() => {
    const habitsFromLocalStorage =
      JSON.parse(localStorage.getItem("activities")) || [];

    const currentHabit = habitsFromLocalStorage.find(
      (activity) => activity.id === id
    );
    const time = currentHabit.history.reduce((acc, item) => {
      if ((item.date = today)) {
        return acc + item.time;
      }
      return null;
    }, 0);
    setHabitDailyTime(time);
    setHabit(currentHabit);
    setActivityLatest(habitsFromLocalStorage);
    console.log("first");
  }, [id, today]);

  return (
    <div className="tracker">
      <div className="habitCard-container">
        <ProgressCircle
          progress={getProgressPercentage(habit.goal, habitDailyTime)}
          size={350}
        />
        {timerActive ? (
          <button onClick={handleStop} className="habitCard-btn red">
            <h3 className="habitCard-emoji">{habit.emoji}</h3>
            <div>
              <h4 className="habitCard-name">{habit.name}</h4>
              <p className="habitCard-goal">{formatTime(elapsedTime)}</p>
            </div>
            <p className="habitCard-start">{t("stop")}</p>
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="habitCard-btn"
            disabled={timerActive}
          >
            <h3 className="habitCard-emoji">{habit.emoji}</h3>
            <div>
              <h4 className="habitCard-name">{habit.name}</h4>
              <p className="habitCard-goal">
                {t("dailyGoal")}: {habit.goal || 0} {t("min")}
              </p>
            </div>
            <p className="habitCard-start">{t("start")}</p>
          </button>
        )}
      </div>

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
          {habit?.history?.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{habit.name}</td>
                <td>{formatTime(item.time)}</td>
                <td>
                  <ProgressCircle
                    progress={getProgressPercentage(habit.goal, item.time)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default HabitPage;
