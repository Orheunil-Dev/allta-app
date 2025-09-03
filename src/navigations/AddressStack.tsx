import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchAddress } from "@/screens/SearchAddress";
import { CustomHeader } from "@/components/common/layout/CustomHeader";
import { RegisterAddress } from "@/screens/RegisterAddress";

export type AddressStackParamList = {
  SearchAddress: undefined;
  RegisterAddress: {
    lat: number;
    lng: number;
  };
};

const Stack = createNativeStackNavigator();

export const AddressStack = () => {
  return (
    <Stack.Navigator initialRouteName="SearchAddress">
      <Stack.Screen
        name="SearchAddress"
        component={SearchAddress}
        options={{
          header: () => <CustomHeader title="주소 검색" showBackButton />,
          presentation: "transparentModal",
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
