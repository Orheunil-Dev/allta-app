import { CustomHeader } from "@/components/common/layout/CustomHeader";
import { StoreList } from "@/screens/StoreList";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type StoreStackParamList = {
  StoreList: {
    serviceType: "AUTO" | "HANDS";
  };
};

const Stack = createNativeStackNavigator();

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
    </Stack.Navigator>
  );
};
