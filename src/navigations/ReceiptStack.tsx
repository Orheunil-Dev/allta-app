import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ReceiptScanComplete,
  ReceiptScanError,
  ReceiptScanner,
} from "@/screens/Receipt";

export type ReceiptStackParamList = {
  ReceiptScanner: undefined;
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
