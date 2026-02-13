import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
    storeId: string;
    storeName: string;
    serviceType: string;
    productType: string;
    carNumber: string;
    approvedAt: string;
    totalAmount: number;
  };
};

const Stack = createNativeStackNavigator();

export const PaymentStack = () => {
  return (
    <Stack.Navigator initialRouteName="Payment">
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          header: () => <CustomHeader title="결제" showBackButton />,
        }}
      />
      <Stack.Screen
        name="PaymentComplete"
        component={PaymentComplete}
        options={{
          header: () => <CustomHeader title="결제 완료" />,
        }}
      />
    </Stack.Navigator>
  );
};
