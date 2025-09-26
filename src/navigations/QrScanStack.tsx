import { QrScan } from "@/screens/QrScan/QrScan";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type QrScanStackParamList = {
  QrScan: undefined;
};

const Stack = createNativeStackNavigator<QrScanStackParamList>();

export const QrScanStack = () => {
  return (
    <Stack.Navigator initialRouteName="QrScan">
      <Stack.Screen
        name="QrScan"
        component={QrScan}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
