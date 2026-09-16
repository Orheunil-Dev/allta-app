import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { Payment, PaymentComplete } from "@/screens/Payment";
import { PassType, ServiceType, CarType } from "@/types";
import { CustomHeader } from "@/components/layout/CustomHeader";

export type PaymentStackParamList = {
  Payment: {
    storeId: string;
    storeName: string;
    storeImage?: string;
    serviceType: ServiceType;
    passType: PassType;
    price: Record<CarType, number>;
  };
  PaymentComplete: {
    serviceType: string;
    productType: string;
    storeName: string;
    carNumber: string;
    approvedAt: string;
    totalAmount: number;
  };
};

const Stack = createNativeStackNavigator();

export const PaymentStack = () => {
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="Payment">
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          header: () => <CustomHeader title={t("payment.payment")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="PaymentComplete"
        component={PaymentComplete}
        options={{
          header: () => <CustomHeader title={t("payment.complete")} />,
        }}
      />
    </Stack.Navigator>
  );
};
