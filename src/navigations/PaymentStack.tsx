import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Payment } from "@/screens/Payment";
import { StoreDetailItemPassPrice } from "@/api/models";
import { PassType, ServiceType } from "@/types";
import { CustomHeader } from "@/components/layout/CustomHeader";

export type PaymentStackParamList = {
  Payment: {
    storeId: string;
    storeName: string;
    serviceType: ServiceType;
    passType: PassType;
    passPrice: StoreDetailItemPassPrice;
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
    </Stack.Navigator>
  );
};
