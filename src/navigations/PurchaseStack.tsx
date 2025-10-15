import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { PurchaseList } from "@/screens/Purchase";

export type PurchaseStackParamList = {
  PurchaseList: undefined;
  PurchaseDetail: {
    id: string;
  };
};

const Stack = createNativeStackNavigator();

export const PurchaseStack = () => {
  return (
    <Stack.Navigator initialRouteName="PurchaseList">
      <Stack.Screen
        name="PurchaseList"
        component={PurchaseList}
        options={{
          header: () => <CustomHeader title="결제 내역" showBackButton />,
        }}
      />{" "}
      <Stack.Screen
        name="PurchaseDetail"
        component={PurchaseList}
        options={{
          header: () => <CustomHeader title="결제 상세" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
