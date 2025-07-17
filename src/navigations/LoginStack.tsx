import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "@/screens/Login";
import {
  SignUpCarRegist,
  SignUpComplete,
  SignUpReferral,
  SignUpServey,
  SignUpUserInfo,
} from "@/screens/SignUp";
import { CustomHeader } from "@/components/common/layout/CustomHeader";
import { CreateUserDtoCarType } from "@/api/models/createUserDtoCarType";

export type LoginStackParamList = {
  Login: undefined;
  SignUpUserInfo: undefined;
  SignUpCarRegist: {
    name: string;
    phoneNumber: string;
  };
  SignUpReferral: {
    name: string;
    phoneNumber: string;
    carBrand?: string;
    carModel?: string;
    carType?: CreateUserDtoCarType;
    carNumber?: string;
  };
  SignUpServey: {
    name: string;
    phoneNumber: string;
    carBrand?: string;
    carModel?: string;
    carType?: CreateUserDtoCarType;
    carNumber?: string;
    referralCode?: string;
  };
  SignUpComplete: undefined;
};

const Stack = createNativeStackNavigator();

export const LoginStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUpUserInfo"
        component={SignUpUserInfo}
        options={{
          header: () => <CustomHeader title="" showBackButton />,
        }}
      />
      <Stack.Screen
        name="SignUpCarRegist"
        component={SignUpCarRegist}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUpReferral"
        component={SignUpReferral}
        options={{
          header: () => <CustomHeader title="" showBackButton />,
        }}
      />
      <Stack.Screen
        name="SignUpServey"
        component={SignUpServey}
        options={{
          header: () => <CustomHeader title="" showBackButton />,
        }}
      />
      <Stack.Screen
        name="SignUpComplete"
        component={SignUpComplete}
        options={{
          header: () => <CustomHeader title="" showBackButton />,
        }}
      />
    </Stack.Navigator>
  );
};
