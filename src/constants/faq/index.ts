import { getCurrentLanguage } from "@/i18n";
import { faqs as ko } from "./ko";
import { faqs as zhTW } from "./zh-TW";
import { Faq } from "./types";

export type { Faq } from "./types";

const FAQS_BY_LANGUAGE: Record<string, Faq[]> = { ko, "zh-TW": zhTW };

export const getFaqs = (): Faq[] => FAQS_BY_LANGUAGE[getCurrentLanguage()];
