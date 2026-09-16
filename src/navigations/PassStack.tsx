import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { PassDetail, PassList } from "@/screens/Pass";
import { PassType } from "@/types";

export type PassStackParamList = {
  PassList: {
    passType?: PassType;
  };
  PassDetail: {
    id: string;
    type: PassType;
  };
};

const Stack = createNativeStackNavigator();

export const PassStack = () => {
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="PassList">
      <Stack.Screen
        name="PassList"
        component={PassList}
        options={{
          header: () => <CustomHeader title={t("pass.list")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="PassDetail"
        component={PassDetail}
        options={{
          header: () => <CustomHeader title={t("pass.detail")} showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
