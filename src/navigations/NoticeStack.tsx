import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { NoticeDetail, NoticeList } from "@/screens/Notice";

export type NoticeStackParamList = {
  NoticeList: undefined;
  NoticeDetail: {
    id: string;
  };
};

const Stack = createNativeStackNavigator();

export const NoticeStack = () => {
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="NoticeList">
      <Stack.Screen
        name="NoticeList"
        component={NoticeList}
        options={{
          header: () => <CustomHeader title={t("notice.title")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="NoticeDetail"
        component={NoticeDetail}
        options={{
          header: () => <CustomHeader title={t("notice.title")} showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
