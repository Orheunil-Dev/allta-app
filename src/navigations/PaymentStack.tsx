import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Payment, PaymentComplete, PaymentList } from "@/screens/Payment";
import { PassType, ServiceType, CarType } from "@/types";
import { CustomHeader } from "@/components/layout/CustomHeader";

export type PaymentStackParamList = {
  PaymentList: undefined;
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
    amount: number;
  };
};

const Stack = createNativeStackNavigator();

export const PaymentStack = () => {
  return (
    <Stack.Navigator initialRouteName="PaymentList">
      <Stack.Screen
        name="PaymentList"
        component={PaymentList}
        options={{
          header: () => <CustomHeader title="결제 내역" showBackButton />,
        }}
      />
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
