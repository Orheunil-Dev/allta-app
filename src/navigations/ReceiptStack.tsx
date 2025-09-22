import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Payment, PaymentComplete } from "@/screens/Payment";
import { PassType, ServiceType, CarType } from "@/types";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { ReceiptScanner } from "@/screens/Receipt";

export type ReceiptStackParamList = {
  ReceiptScanner: undefined;
  ScanComplete: undefined;
};

const Stack = createNativeStackNavigator();

export const ReceiptStack = () => {
  return (
    <Stack.Navigator initialRouteName="ReceiptScanner">
      <Stack.Screen
        name="ReceiptScanner"
        component={ReceiptScanner}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ScanComplete"
        component={PaymentComplete}
        options={{
          header: () => <CustomHeader title="영수증 할인" />,
        }}
      />
    </Stack.Navigator>
  );
};
