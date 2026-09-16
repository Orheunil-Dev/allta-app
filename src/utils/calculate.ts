import dayjs from "dayjs";

export const getAvailablePeriod = (
  paidAt: string | Date,
  billingDate: number,
): string => {
  const start = dayjs(paidAt);

  // 다음달
  const nextMonth = start.add(1, "month");

  // 다음달의 실제 일수
  const daysInNextMonth = nextMonth.daysInMonth();

  // billingDate가 해당 달 일수보다 크면 보정
  const safeBillingDate = Math.min(billingDate, daysInNextMonth);

  // 다음달 billingDate - 1일
  const end = nextMonth.date(safeBillingDate).subtract(1, "day");

  return `${start.format("YY.MM.DD")}~${end.format("YY.MM.DD")}`;
};
