import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchAddress } from "@/screens/SearchAddress";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { RegisterAddress } from "@/screens/RegisterAddress";
import { AddressList } from "@/screens/Address";

export type AddressStackParamList = {
  AddressList: undefined;
  SearchAddress: undefined;
  RegisterAddress: {
    lat: number;
    lng: number;
  };
};

const Stack = createNativeStackNavigator();

export const AddressStack = () => {
  return (
    <Stack.Navigator initialRouteName="AddressList">
      <Stack.Screen
        name="AddressList"
        component={AddressList}
        options={{
          header: () => <CustomHeader title="주소 관리" showBackButton />,
        }}
      />
      <Stack.Screen
        name="SearchAddress"
        component={SearchAddress}
        options={{
          header: () => <CustomHeader title="주소 검색" showBackButton />,
        }}
      />
      <Stack.Screen
        name="RegisterAddress"
        component={RegisterAddress}
        options={{
          header: () => <CustomHeader title="주소 등록" showBackButton />,
          presentation: "card",
        }}
      />
    </Stack.Navigator>
  );
};
