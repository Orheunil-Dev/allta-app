import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { PurchaseDetail, PurchaseList } from "@/screens/Purchase";

export type PurchaseStackParamList = {
  PurchaseList: undefined;
  PurchaseDetail: {
    id: string;
  };
};

const Stack = createNativeStackNavigator();

export const PurchaseStack = () => {
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="PurchaseList">
      <Stack.Screen
        name="PurchaseList"
        component={PurchaseList}
        options={{
          header: () => <CustomHeader title={t("purchase.list")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="PurchaseDetail"
        component={PurchaseDetail}
        options={{
          header: () => <CustomHeader title={t("purchase.detail")} showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
