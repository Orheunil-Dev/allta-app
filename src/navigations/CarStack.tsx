import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { CarList, CarRegister, CarUpdate } from "@/screens/Car";
import { Car } from "@/types";

export type CarStackParamList = {
  CarList: undefined;
  CarRegister: undefined;
  CarUpdate: {
    car: Car;
  };
};

const Stack = createNativeStackNavigator();

export const CarStack = () => {
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="CarList">
      <Stack.Screen
        name="CarList"
        component={CarList}
        options={{
          header: () => <CustomHeader title={t("car.list")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="CarRegister"
        component={CarRegister}
        options={{
          header: () => <CustomHeader title={t("car.register")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="CarUpdate"
        component={CarUpdate}
        options={{
          header: () => <CustomHeader title={t("car.update")} showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
