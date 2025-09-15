import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { CardRegister } from "@/screens/Card";

export type CardStackParamList = {
  CardRegister: undefined;
};

const Stack = createNativeStackNavigator();

export const CardStack = () => {
  return (
    <Stack.Navigator initialRouteName="CardRegister">
      <Stack.Screen
        name="CardRegister"
        component={CardRegister}
        options={{
          header: () => <CustomHeader title="카드 등록" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
