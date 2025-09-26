export type CustomError = {
  message: string | null;
  status: number;
  code?: string;
};

export type DayKey = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
