import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BottomNav = () => {
  const { t } = useTranslation();

  return (
    <div className="bottom-nav">
      <NavLink to="/" className="nav-item">
        🏠 {t("home")}
      </NavLink>
      <NavLink to="/add" className="nav-item">
        ➕
      </NavLink>
      <NavLink to="/settings" className="nav-item">
        ⚙️ {t("settings")}
      </NavLink>
    </div>
  );
};

export default BottomNav;
