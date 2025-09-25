import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ReceiptScanComplete,
  ReceiptScanError,
  ReceiptScan,
} from "@/screens/Receipt";

export type ReceiptScanStackParamList = {
  ReceiptScan: undefined;
  ReceiptScanError: {
    code: string;
    message: string;
  };
  ReceiptScanComplete: {
    storeName: string;
    discountType: string;
    discountValue: number;
    createdAt: string;
    expiredAt: string;
  };
};

const Stack = createNativeStackNavigator();

export const ReceiptScanStack = () => {
  return (
    <Stack.Navigator initialRouteName="ReceiptScan">
      <Stack.Screen
        name="ReceiptScan"
        component={ReceiptScan}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReceiptScanError"
        component={ReceiptScanError}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReceiptScanComplete"
        component={ReceiptScanComplete}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
