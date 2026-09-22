import i18n from "@/i18n";
import { DayKey } from "@/types";

export const dayOrder: DayKey[] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

const dayLabelKeys: Record<DayKey, string> = {
  MON: "mon",
  TUE: "tue",
  WED: "wed",
  THU: "thu",
  FRI: "fri",
  SAT: "sat",
  SUN: "sun",
};

export const getDayLabel = (day: DayKey): string =>
  i18n.t(`store:day.${dayLabelKeys[day]}`);
