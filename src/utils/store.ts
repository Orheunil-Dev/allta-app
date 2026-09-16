import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import i18n from "@/i18n";
import { DayKey } from "@/types";

dayjs.extend(isBetween);

type BusinessHours = Record<string, { open: string; close: string }>;

type StoreBusinessHours = {
  status: string;
  hours: string;
  isOpen: boolean;
};

// dayjs.day()는 일요일이 0 (전역 dayjs 로케일과 무관하게 요일 키를 구하기 위함)
const DAY_KEYS_BY_WEEKDAY: DayKey[] = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

const getDayKey = (date: dayjs.Dayjs): DayKey =>
  DAY_KEYS_BY_WEEKDAY[date.day()];

// 가장 빠른 영업일 영업시간
const findNextOpenHour = (
  businessHours: BusinessHours,
  now: dayjs.Dayjs
): string | null => {
  for (let i = 1; i <= 7; i++) {
    const next = now.add(i, "day");
    const hours = businessHours?.[getDayKey(next)];

    if (hours?.open) {
      return hours.open;
    }
  }

  return null;
};

const closedUntilNextOpen = (
  businessHours: BusinessHours,
  now: dayjs.Dayjs,
  status: string
): StoreBusinessHours => ({
  status,
  hours: i18n.t("store:businessHours.nextOpensAt", {
    time: findNextOpenHour(businessHours, now) ?? "",
  }),
  isOpen: false,
});

// 영업 상태
export const getStoreBusinessHours = (
  businessHours: BusinessHours,
  breakTime?: string | null,
  holidays?: string | null
): StoreBusinessHours => {
  if (!businessHours || !Object.keys(businessHours).length)
    return {
      status: i18n.t("store:businessHours.closed"),
      hours: "",
      isOpen: false,
    };

  // 오늘 영업시간
  const now = dayjs();
  const today = dayjs().format("YYYY-MM-DD");
  const hours = businessHours?.[getDayKey(now)];

  // 휴무일
  const holidayList = holidays?.split(",").map((h) => h.trim());
  const todayIsHoliday = holidayList?.includes(now.format("YYYY-MM-DD"));

  if (!hours || todayIsHoliday)
    return closedUntilNextOpen(
      businessHours,
      now,
      i18n.t("store:businessHours.closed")
    );

  // 영업시간
  const open = dayjs(`${today} ${hours.open}`, "YYYY-MM-DD HH:mm");
  const close = dayjs(`${today} ${hours.close}`, "YYYY-MM-DD HH:mm");

  if (now.isBefore(open)) {
    return {
      status: i18n.t("store:businessHours.beforeOpen"),
      hours: i18n.t("store:businessHours.opensAt", { time: hours.open }),
      isOpen: false,
    };
  }

  if (now.isAfter(close)) {
    return closedUntilNextOpen(
      businessHours,
      now,
      i18n.t("store:businessHours.ended")
    );
  }

  // 브레이크 타임
  if (breakTime) {
    const [start, end] = breakTime.split("~").map((t) => t.trim());

    const breakStart = dayjs(`${today} ${start}`, "YYYY-MM-DD HH:mm");
    const breakEnd = dayjs(`${today} ${end}`, "YYYY-MM-DD HH:mm");

    if (now.isBetween(breakStart, breakEnd, null, "[)")) {
      return {
        status: i18n.t("store:businessHours.breakTime"),
        hours: i18n.t("store:businessHours.resumesAt", { time: end }),
        isOpen: false,
      };
    }
  }

  return {
    status: i18n.t("store:businessHours.open"),
    hours: `${hours.open} ~ ${hours.close}`,
    isOpen: true,
  };
};
