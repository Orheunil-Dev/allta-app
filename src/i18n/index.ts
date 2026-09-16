import dayjs from "dayjs";
import "dayjs/locale/ko";
import "dayjs/locale/zh-tw";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./locales/ko";
import zhTW from "./locales/zh-TW";

export type AppLanguage = "zh-TW" | "ko";

export const DEFAULT_LANGUAGE: AppLanguage = "zh-TW";

const DAYJS_LOCALE: Record<AppLanguage, string> = {
  "zh-TW": "zh-tw",
  ko: "ko",
};

// 기기 언어가 한국어일 때만 ko, 그 외는 모두 기본 언어(대만 번체)
const resolveDeviceLanguage = (): AppLanguage => {
  const deviceLanguageCode = getLocales()[0]?.languageCode;
  return deviceLanguageCode === "ko" ? "ko" : DEFAULT_LANGUAGE;
};

const language = resolveDeviceLanguage();

export const getCurrentLanguage = (): AppLanguage =>
  i18n.language === "ko" ? "ko" : DEFAULT_LANGUAGE;

i18n.use(initReactI18next).init({
  resources: { "zh-TW": zhTW, ko },
  lng: language,
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: "common",
  ns: Object.keys(zhTW),
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

dayjs.locale(DAYJS_LOCALE[language]);

export default i18n;
