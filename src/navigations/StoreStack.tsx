import { CustomHeader } from "@/components/common/layout/CustomHeader";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "@/screens/Home";
import { Stores } from "@/screens/Stores";

export type StoreStackParamList = {
  Stores: {
    serviceType: "AUTO" | "HANDS";
  };
};

const Stack = createNativeStackNavigator();

export const StoreStack = () => {
  return (
    <Stack.Navigator initialRouteName="Stores">
      <Stack.Screen
        name="Stores"
        component={Stores}
        options={{
          header: () => <CustomHeader title="매장 둘러보기" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
