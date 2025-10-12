import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeader } from "@/components/layout/CustomHeader";
import {
  NotificationSetting,
  Setting,
  TermsDetail,
  TermsList,
} from "@/screens/Setting";

export type SettingStackParamList = {
  Setting: undefined;
  NotificationSetting: undefined;
  TermsList: undefined;
  TermsDetail: {
    title: string;
  };
};

const Stack = createNativeStackNavigator<SettingStackParamList>();

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
      <Stack.Screen
        name="TermsList"
        component={TermsList}
        options={{
          header: () => <CustomHeader title="약관 및 정책" showBackButton />,
        }}
      />
      <Stack.Screen
        name="TermsDetail"
        component={TermsDetail}
        options={({ route }) => ({
          header: () => (
            <CustomHeader title={route.params.title} showBackButton />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
