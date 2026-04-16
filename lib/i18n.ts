import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: "Home",
      politicians: "Politicians",
      parties: "Parties",
      states: "States",
      news: "News",
      map: "Map",
      timeline: "Timeline",
      compare: "Compare",
      admin: "Admin",
      feedback: "Feedback",
    },
  },
  hi: {
    translation: {
      home: "होम",
      politicians: "नेता",
      parties: "पार्टियां",
      states: "राज्य",
      news: "समाचार",
      map: "मैप",
      timeline: "टाइमलाइन",
      compare: "तुलना",
      admin: "एडमिन",
      feedback: "फीडबैक",
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
