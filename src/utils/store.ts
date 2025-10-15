import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

// 가장 빠른 영업일 영업시간
const findNextOpenHour = (
  businessHours: Record<string, { open: string; close: string }>,
  now: dayjs.Dayjs
): string | null => {
  for (let i = 1; i <= 7; i++) {
    const next = now.add(i, "day");
    const dayKey = next.format("ddd").toUpperCase();
    const hours = businessHours?.[dayKey];

    if (hours?.open) {
      return hours.open;
    }
  }

  return null;
};

// 영업 상태
export const getStoreBusinessHours = (
  businessHours: Record<string, { open: string; close: string }>,
  breakTime?: string | null,
  holidays?: string | null
): { status: string; hours: string } => {
  if (!businessHours || !Object.keys(businessHours).length)
    return { status: "휴무", hours: "" };

  // 오늘 영업시간
  const now = dayjs();
  const today = dayjs().format("YYYY-MM-DD");
  const dayKey = now.format("ddd").toUpperCase();
  const hours = businessHours?.[dayKey];

  // 휴무일
  const holidayList = holidays?.split(",").map((h) => h.trim());
  const todayIsHoliday = holidayList?.includes(now.format("YYYY-MM-DD"));

  if (!hours || todayIsHoliday)
    return {
      status: "휴무",
      hours: `${findNextOpenHour(businessHours, now)} 오픈 예정`,
    };

  // 영업시간
  const open = dayjs(`${today} ${hours.open}`, "YYYY-MM-DD HH:mm");
  const close = dayjs(`${today} ${hours.close}`, "YYYY-MM-DD HH:mm");

  if (now.isBefore(open)) {
    return {
      status: "영업 전",
      hours: `${hours.open} 오픈`,
    };
  }

  if (now.isAfter(close)) {
    return {
      status: "영업 종료",
      hours: `${findNextOpenHour(businessHours, now)} 오픈 예정`,
    };
  }

  // 브레이크 타임
  if (breakTime) {
    const [start, end] = breakTime.split("~").map((t) => t.trim());

    const breakStart = dayjs(`${today} ${start}`, "YYYY-MM-DD HH:mm");
    const breakEnd = dayjs(`${today} ${end}`, "YYYY-MM-DD HH:mm");

    if (now.isBetween(breakStart, breakEnd, null, "[)")) {
      return { status: "브레이크타임", hours: `${end} 영업 시작` };
    }
  }

  return { status: "영업중", hours: `${hours.open} ~ ${hours.close}` };
};
