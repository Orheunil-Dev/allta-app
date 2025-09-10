export type Car = {
  id: string;
  carBrand: string;
  carModel: string;
  carType: string;
  carNumber: string;
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
