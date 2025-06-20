import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../locales/i18n";

const Settings = () => {
  const { t } = useTranslation();
  // const [newActivity, setNewActivity] = useState("");
  // const [newGoal, setNewGoal] = useState("");
  const [, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("habitHistory");
    return savedHistory ? JSON.parse(savedHistory) : {};
  });
  // const [activities, setActivities] = useState(() => {
  //   const savedActivities = localStorage.getItem("habitActivities");
  //   return savedActivities ? JSON.parse(savedActivities) : ["Sport"];
  // });
  // const [goals, setGoals] = useState(() => {
  //   const savedGoals = localStorage.getItem("habitGoals");
  //   return savedGoals ? JSON.parse(savedGoals) : {};
  // });

  // useEffect(() => {
  //   localStorage.setItem("habitActivities", JSON.stringify(activities));
  //   localStorage.setItem("habitGoals", JSON.stringify(goals));
  // }, [activities, goals]);

  const handleClearHistory = () => {
    setHistory({});
    localStorage.removeItem("habitHistory");
  };

  // const handleAddActivity = () => {
  //   if (newActivity.trim() && !activities.includes(newActivity)) {
  //     setActivities([...activities, newActivity]);
  //     setGoals({ ...goals, [newActivity]: Number(newGoal) || 0 });
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

  return (
    <div className="settings">
      {/* <div className="activity-form">
        <input
          type="text"
          placeholder={t("addActivity")}
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
        />
        <input
          type="number"
          placeholder={t("setDailyGoal")}
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button onClick={handleAddActivity}>{t("add")}</button>
      </div>

      <div className="activity-grid">
        {activities.reverse().map((activity) => (
          <div className="activity-card" key={activity}>
            <h3>{activity}</h3>
            <p>
              {t("dailyGoal")}: {goals[activity] || 0} {t("min")}
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

      <h1>{t("settingsTitle")}</h1>

      <label>{t("langSwitch")}: </label>
      <select
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        value={i18n.language}
      >
        <option value="ru">Русский</option>
        <option value="en">English</option>
        <option value="uk">Українська</option>
      </select>

      <button onClick={handleClearHistory} className="clear-btn">
        {t("clear")}
      </button>
    </div>
  );
};

export default Settings;
