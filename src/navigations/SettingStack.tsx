import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { NotificationSetting, Setting } from "@/screens/Setting";

export type SettingStackParamList = {
  Setting: undefined;
  NotificationSetting: undefined;
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
      <Stack.Screen
        name="NotificationSetting"
        component={NotificationSetting}
        options={{
          header: () => <CustomHeader title="알림 설정" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
