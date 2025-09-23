import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
  return (
    <Stack.Navigator initialRouteName="StoreList">
      <Stack.Screen
        name="StoreList"
        component={StoreList}
        options={{
          header: () => <CustomHeader title="매장 둘러보기" showBackButton />,
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
