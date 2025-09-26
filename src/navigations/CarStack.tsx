import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Payment, PaymentComplete } from "@/screens/Payment";
import { PassType, ServiceType, CarType } from "@/types";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { CarRegister } from "@/screens/Car";

export type CarStackParamList = {
  CarRegister: undefined;
};

const Stack = createNativeStackNavigator();

export const CarStack = () => {
  return (
    <Stack.Navigator initialRouteName="CarRegister">
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
