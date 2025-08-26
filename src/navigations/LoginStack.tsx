import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "@/screens/Login";
import {
  SignUpComplete,
  SignUpReferral,
  SignUpTerms,
  SignUpUserInfo,
} from "@/screens/SignUp";
import { RegisterCar } from "@/screens/Register";
import { CustomHeader } from "@/components/common/layout/CustomHeader";

export type LoginStackParamList = {
  Login: undefined;
  SignUpTerms: {
    loginKind: string;
    socialId: string;
    email: string;
  };
  SignUpUserInfo: {
    loginKind: string;
    socialId: string;
    email: string;
    isMarketing: boolean;
  };
  SignUpReferral: {
    loginKind: string;
    socialId: string;
    email: string;
    name: string;
    phoneNumber: string;
    isMarketing: boolean;
  };
  SignUpComplete: undefined;
  RegisterCar: undefined;
  RegisterCard: {
    carBrand?: string;
    carType?: string;
    carModel?: string;
    carNumber?: string;
  };
  RegisterCompelete: {
    isRegister: boolean;
  };
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
        name="SignUpTerms"
        component={SignUpTerms}
        options={{
          header: () => <CustomHeader title="" showBackButton />,
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
        name="SignUpReferral"
        component={SignUpReferral}
        options={{
          header: () => <CustomHeader title="" showBackButton />,
        }}
      />
      <Stack.Screen
        name="SignUpComplete"
        component={SignUpComplete}
        options={{
          header: () => <CustomHeader title="" />,
        }}
      />
      <Stack.Screen
        name="RegisterCar"
        component={RegisterCar}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RegisterCard"
        component={RegisterCar}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
