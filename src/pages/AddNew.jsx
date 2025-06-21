import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

function AddNew() {
  const [newActivity, setNewActivity] = useState("");
  const [activityLatest, setActivityLatest] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [emoji, setEmoji] = useState("");
  const { t } = useTranslation();

  //=========================== Old functionality ==========================

  // const [activities, setActivities] = useState(() => {
  //   const savedActivities = localStorage.getItem("habitActivities");
  //   return savedActivities ? JSON.parse(savedActivities) : ["Sport"];
  // });
  // const [goals, setGoals] = useState(() => {
  //   const savedGoals = localStorage.getItem("habitGoals");
  //   return savedGoals ? JSON.parse(savedGoals) : {};
  // });

  // const handleAddActivity = () => {
  //   addActivityToLocalStorage();
  //   if (newActivity.trim() && !activities.includes(newActivity)) {
  //     setActivities([...activities, newActivity]);
  //     setGoals({
  //       ...goals,
  //       [newActivity]: Number(newGoal) || 0,
  //       ids: uuidv4(),
  //     });
  //     setNewActivity("");
  //     setNewGoal("");
  //   }
  // };
  // const handleRemoveActivity = (activityToRemove) => {
  //   setActivities(
  //     activities.filter((activity) => activity !== activityToRemove)
  //   );
  //   const updatedGoals = { ...goals };
  //   delete updatedGoals[activityToRemove];
  //   setGoals(updatedGoals);
  // };
  // useEffect(() => {
  //   localStorage.setItem("habitActivities", JSON.stringify(activities));
  //   localStorage.setItem("habitGoals", JSON.stringify(goals));
  // }, [activities, goals]);

  // =========================== New functionality ==========================

  const createActivity = (name, goal, emoji) => {
    const newActivity = {
      id: uuidv4(),
      name,
      emoji,
      goal: Number(goal) || 0,
      timerStarted: null,
      history: [],
    };
    return newActivity;
  };

  const deleteActivity = (activityId) => {
    const updatedActivityLatest = activityLatest.filter(
      (activity) => activity.id !== activityId
    );
    localStorage.setItem("activities", JSON.stringify(updatedActivityLatest));
    setActivityLatest(updatedActivityLatest);
  };

  const addActivityToLocalStorage = () => {
    const newHabit = createActivity(newActivity, newGoal || 0, emoji);
    const existingActivities =
      JSON.parse(localStorage.getItem("activities")) || [];
    existingActivities.push(newHabit);
    localStorage.setItem("activities", JSON.stringify(existingActivities));
    setActivityLatest(existingActivities);
    setNewActivity("");
    setNewGoal("");
    setEmoji("");
  };

  useEffect(() => {
    const existingActivities =
      JSON.parse(localStorage.getItem("activities")) || [];
    setActivityLatest(existingActivities);
  }, []);

  return (
    <div className="settings">
      <div className="settings-container">
        <h2>{t("manageActivities")}</h2>{" "}
        <div className="activity-form">
          <input
            type="text"
            inputMode="emoji"
            placeholder={t("addEmoji")}
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("addActivity")}
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
          />
          <input
            type="number"
            inputMode="numeric"
            placeholder={t("setDailyGoal")}
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
          />
          <button onClick={addActivityToLocalStorage}>{t("add")}</button>{" "}
        </div>
      </div>
      <h2>{t("allActivities")} NEWONE</h2>
      <div className="activity-grid">
        {activityLatest.map((data) => {
          return (
            <div className="activity-card" key={data.id}>
              <h3 className="header-emoji">{data.emoji}</h3>
              <h3>{data.name}</h3>
              <p>
                {t("dailyGoal")}: {data.goal || 0} {t("min")}{" "}
              </p>
              <button
                className="remove-btn"
                onClick={() => deleteActivity(data.id)}
              >
                {t("remove")}
              </button>
            </div>
          );
        })}
      </div>
      {/* <h2>{t("allActivities")}</h2> */}
      {/* <div className="activity-grid">
        {activities.reverse().map((activity) => (
          <div className="activity-card" key={activity}>
            <h3>{activity}</h3>{" "}
            <p>
              {t("dailyGoal")}: {goals[activity] || 0} {t("min")}{" "}
            </p>
            <button
              className="remove-btn"
              onClick={() => handleRemoveActivity(activity)}
            >
              {t("remove")}
            </button>
          </div>
        ))}
      </div> */}
    </div>
  );
}
export default AddNew;
