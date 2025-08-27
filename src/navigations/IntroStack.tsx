import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Permission } from "@/screens/Intro";
import { CustomHeader } from "@/components/common/layout/CustomHeader";

export type IntroStackParamList = {
  Permission: undefined;
};

const Stack = createNativeStackNavigator();

export const IntroStack = () => {
  return (
    <Stack.Navigator initialRouteName="Permission">
      <Stack.Screen
        name="Permission"
        component={Permission}
        options={{
          header: () => <CustomHeader title="" />,
        }}
      />
    </Stack.Navigator>
  );
};
