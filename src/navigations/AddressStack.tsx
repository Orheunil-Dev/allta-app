import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { SearchAddress } from "@/screens/SearchAddress";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { RegisterAddress } from "@/screens/RegisterAddress";
import { AddressList } from "@/screens/Address";

export type AddressStackParamList = {
  AddressList: undefined;
  SearchAddress: undefined;
  RegisterAddress: {
    fullAddress?: string;
    roadName?: string;
    buildingName?: string | null;
    lat: number;
    lng: number;
  };
};

const Stack = createNativeStackNavigator();

export const AddressStack = () => {
  const { t } = useTranslation("nav");

  return (
    <Stack.Navigator initialRouteName="AddressList">
      <Stack.Screen
        name="AddressList"
        component={AddressList}
        options={{
          header: () => <CustomHeader title={t("address.list")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="SearchAddress"
        component={SearchAddress}
        options={{
          header: () => <CustomHeader title={t("address.search")} showBackButton />,
        }}
      />
      <Stack.Screen
        name="RegisterAddress"
        component={RegisterAddress}
        options={{
          header: () => <CustomHeader title={t("address.register")} showBackButton />,
          presentation: "card",
        }}
      />
    </Stack.Navigator>
  );
};
