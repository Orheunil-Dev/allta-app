import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { CardList, CardRegister } from "@/screens/Card";

export type CardStackParamList = {
  CardList: undefined;
  CardRegister: undefined;
};

const Stack = createNativeStackNavigator();

export const CardStack = () => {
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="CardList">
      <Stack.Screen
        name="CardList"
        component={CardList}
        options={{
          header: () => <CustomHeader title={t("card.list")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="CardRegister"
        component={CardRegister}
        options={{
          header: () => <CustomHeader title={t("card.register")} showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
