import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en.json";
import translationRU from "./locales/ru.json";

const resources = {
  en: { translation: translationEN },
  ru: { translation: translationRU },
};

// Определение языка системы
const systemLanguage = navigator.language.startsWith("ru") ? "ru" : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: systemLanguage, // Установка языка системы
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
