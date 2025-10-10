import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { Setting } from "@/screens/Setting";

export type SettingStackParamList = {
  Setting: undefined;
};

const Stack = createNativeStackNavigator();

export const SettingStack = () => {
  return (
    <Stack.Navigator initialRouteName="Setting">
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{
          header: () => <CustomHeader title="앱 설정" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
