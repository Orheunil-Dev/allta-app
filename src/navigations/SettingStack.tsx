import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { CustomHeader } from "@/components/layout/CustomHeader";
import {
  NotificationSetting,
  Setting,
  TermsDetail,
  TermsList,
  Withdrawal,
} from "@/screens/Setting";

export type SettingStackParamList = {
  Setting: undefined;
  NotificationSetting: undefined;
  TermsList: undefined;
  TermsDetail: {
    title: string;
    index: number;
  };
  Withdrawal: undefined;
};

const Stack = createNativeStackNavigator<SettingStackParamList>();

export const SettingStack = () => {
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="Setting">
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{
          header: () => <CustomHeader title={t("setting.setting")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="NotificationSetting"
        component={NotificationSetting}
        options={{
          header: () => <CustomHeader title={t("setting.notification")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="TermsList"
        component={TermsList}
        options={{
          header: () => <CustomHeader title={t("setting.terms")} showBackButton />,
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
      <Stack.Screen
        name="Withdrawal"
        component={Withdrawal}
        options={{
          header: () => <CustomHeader title="" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
