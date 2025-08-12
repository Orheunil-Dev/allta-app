import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "@/screens/Login";
import { SignUpComplete, SignUpTerms, SignUpUserInfo } from "@/screens/SignUp";
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
  };
  SignUpComplete: undefined;
  // SignUpCarRegist: {
  //   loginKind: string;
  //   socialId: string;
  //   email: string;
  //   name: string;
  //   phoneNumber: string;
  // };
  // SignUpReferral: {
  //   loginKind: string;
  //   socialId: string;
  //   email: string;
  //   name: string;
  //   phoneNumber: string;
  //   carBrand?: string;
  //   carModel?: string;
  //   carType?: string;
  //   carNumber?: string;
  // };
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
        name="SignUpComplete"
        component={SignUpComplete}
        options={{
          header: () => <CustomHeader title="" />,
        }}
      />
      {/* <Stack.Screen
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
      /> */}
    </Stack.Navigator>
  );
};
