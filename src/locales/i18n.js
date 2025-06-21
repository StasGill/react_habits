import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./en.json";
import translationRU from "./ru.json";
import translationUK from "./uk.json";

const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
  uk: { translation: translationUK },
};

// Определение языка системы
const systemLanguage = navigator.language.startsWith("ru")
  ? "ru"
  : navigator.language.startsWith("uk")
  ? "uk"
  : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: systemLanguage, // Установка языка системы
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
