import { MyStore } from "@/screens/MyStore";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export const MyStoreStack = () => {
  return (
    <Stack.Navigator initialRouteName="MyStore">
      <Stack.Screen
        name="MyStore"
        component={MyStore}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
