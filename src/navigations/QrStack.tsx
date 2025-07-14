import { QrScan } from "@/screens/QrScan/QrScan";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export const QrStack = () => {
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
