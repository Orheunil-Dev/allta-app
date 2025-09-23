import { CustomHeader } from "@/components/layout/CustomHeader";
import { MyStoreList } from "@/screens/MyStore";
import { formatEllipsis } from "@/utils";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type MyStoreStackParamList = {
  MyStoreList: undefined;
  MyStoreDetail: {
    storeId: string;
    storeName: string;
  };
};

const Stack = createNativeStackNavigator<MyStoreStackParamList>();

export const MyStoreStack = () => {
  return (
    <Stack.Navigator initialRouteName="MyStoreList">
      <Stack.Screen
        name="MyStoreList"
        component={MyStoreList}
        options={{
          header: () => <CustomHeader title="내 매장" showBackButton />,
        }}
      />
      <Stack.Screen
        name="MyStoreDetail"
        component={MyStoreList}
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
