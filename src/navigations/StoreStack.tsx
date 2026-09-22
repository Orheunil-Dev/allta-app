import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { StoreDetail, StoreList } from "@/screens/Store";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { ServiceType } from "@/types";
import { formatEllipsis } from "@/utils";

export type StoreStackParamList = {
  StoreList: {
    serviceType: ServiceType;
  };
  StoreDetail: {
    serviceType: ServiceType;
    storeId: string;
    storeName: string;
    storeGroupId?: string;
  };
};

const Stack = createNativeStackNavigator<StoreStackParamList>();

export const StoreStack = () => {
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="StoreList">
      <Stack.Screen
        name="StoreList"
        component={StoreList}
        options={{
          header: () => <CustomHeader title={t("store.list")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="StoreDetail"
        component={StoreDetail}
        options={({ route }) => ({
          header: () => (
            <CustomHeader
              title={formatEllipsis(route.params.storeName, 12)}
              showBackButton
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};
