import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { CarList, CarRegister } from "@/screens/Car";

export type CarStackParamList = {
  CarList: undefined;
  CarRegister: undefined;
};

const Stack = createNativeStackNavigator();

export const CarStack = () => {
  return (
    <Stack.Navigator initialRouteName="CarList">
      <Stack.Screen
        name="CarList"
        component={CarList}
        options={{
          header: () => <CustomHeader title="차량 관리" showBackButton />,
        }}
      />
      <Stack.Screen
        name="CarRegister"
        component={CarRegister}
        options={{
          header: () => <CustomHeader title="차량 등록" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
