export type ServiceType = "AUTO" | "HANDS";

export type PassType = "TICKET" | "STANDARD" | "PREMIUM";

export type CarType = "SEDAN" | "SUV" | "VAN";

export type PassPrice = {
  TICKET?: Record<string, number>;
  STANDARD?: Record<string, number>;
  PREMIUM?: Record<string, number>;
};
