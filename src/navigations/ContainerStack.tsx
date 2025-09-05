import {
  NavigationContainer,
  NavigatorScreenParams,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Notification } from "@/screens/Notification";
import { CustomHeader } from "@/components/layout/CustomHeader";
import { BottomTab, BottomTabParamList } from "./BottomTab";
import { LoginStack, LoginStackParamList } from "./LoginStack";
import { LoginModal } from "@/components/modal/LoginModal";
import { checkIsFirstLaunch } from "@/utils";
import { IntroStack, IntroStackParamList } from "./IntroStack";
import { StoreStack, StoreStackParamList } from "./StoreStack";
import { AddressStack, AddressStackParamList } from "./AddressStack";
import { PaymentStack, PaymentStackParamList } from "./PaymentStack";

export type ContainerStackParamList = {
  BottomTab: NavigatorScreenParams<BottomTabParamList>;
  IntroStack: NavigatorScreenParams<IntroStackParamList>;
  StoreStack: NavigatorScreenParams<StoreStackParamList>;
  LoginStack: NavigatorScreenParams<LoginStackParamList>;
  AddressStack: NavigatorScreenParams<AddressStackParamList>;
  PaymentStack: NavigatorScreenParams<PaymentStackParamList>;
  Notification: undefined;
};

const Stack = createNativeStackNavigator();

interface Props {
  showLoginModal: boolean;
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContainerStack = ({
  showLoginModal,
  setShowLoginModal,
}: Props) => {
  const navigationRef = useNavigationContainerRef();

  const isFirstLaunch = checkIsFirstLaunch();

  return (
    <NavigationContainer ref={navigationRef}>
      <LoginModal
        navigationRef={navigationRef}
        visible={showLoginModal}
        setVisible={setShowLoginModal}
      />

      <Stack.Navigator
        initialRouteName={isFirstLaunch ? `IntroStack` : `BottomTab`}
      >
        <Stack.Screen
          name="IntroStack"
          component={IntroStack}
          options={{
            headerShown: false,
            presentation: "transparentModal",
          }}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            header: () => <CustomHeader title="알림" showBackButton />,
          }}
        />
        <Stack.Screen
          name="StoreStack"
          component={StoreStack}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LoginStack"
          component={LoginStack}
          options={{
            headerShown: false,
            presentation: "transparentModal",
          }}
        />
        <Stack.Screen
          name="AddressStack"
          component={AddressStack}
          options={{
            headerShown: false,
            presentation: "transparentModal",
          }}
        />
        <Stack.Screen
          name="PaymentStack"
          component={PaymentStack}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
