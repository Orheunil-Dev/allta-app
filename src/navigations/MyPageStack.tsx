import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyPage } from "@/screens/MyPage";

const Stack = createNativeStackNavigator();

export const MyPageStack = () => {
  return (
    <Stack.Navigator initialRouteName="MyPage">
      <Stack.Screen
        name="MyPage"
        component={MyPage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
