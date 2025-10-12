import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { CardList, CardRegister } from "@/screens/Card";

export type CardStackParamList = {
  CardList: undefined;
  CardRegister: undefined;
};

const Stack = createNativeStackNavigator();

export const CardStack = () => {
  return (
    <Stack.Navigator initialRouteName="CardList">
      <Stack.Screen
        name="CardList"
        component={CardList}
        options={{
          header: () => <CustomHeader title="카드 관리" showBackButton />,
        }}
      />
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
