import { getCurrentLanguage } from "@/i18n";
import * as ko from "./ko";
import * as zhTW from "./zh-TW";
import { Terms } from "./types";

export type { Terms } from "./types";

const TERMS_BY_LANGUAGE = { ko, "zh-TW": zhTW };

export const getTerms = (): Terms[] => TERMS_BY_LANGUAGE[getCurrentLanguage()].terms;

export const getPaymentTerms = (): string =>
  TERMS_BY_LANGUAGE[getCurrentLanguage()].paymentTerms;
