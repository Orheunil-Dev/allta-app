export type CustomError = {
  message: string | null;
  status: number;
  code?: string;
};

export type DayKey = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export type Address = {
  id: string;
  nickname: string;
  fullAddress: string;
  lat: number;
  lng: number;
};
