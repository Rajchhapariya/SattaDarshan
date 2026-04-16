"use client";

import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export function ThemeLanguageControls() {
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300"
      >
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      <button
        onClick={() => i18n.changeLanguage(i18n.language === "en" ? "hi" : "en")}
        className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 hindi"
      >
        {i18n.language === "en" ? "हि" : "EN"}
      </button>
    </div>
  );
}
