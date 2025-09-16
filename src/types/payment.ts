export type Car = {
  id: string;
  vendor: string;
  model: string;
  type: string;
  number: string;
  isMain: boolean;
};

export type Card = {
  id: string;
  cardCompany: string;
  cardDisplayNumber: string;
  isMain: boolean;
};

export type Coupon = {
  id: string;
  name: string;
  type: string;
  passType?: string | null;
  serviceType?: string | null;
  discountType: string;
  discountValue: number;
  expiredAt?: string | null;
  targetStoreCount: number | null;
};
