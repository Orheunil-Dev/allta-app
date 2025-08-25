import {
  NavigationContainer,
  NavigatorScreenParams,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alarm } from "@/screens/Alarm";
import { CustomHeader } from "@/components/common/layout/CustomHeader";
import { BottomTab, BottomTabParamList } from "./BottomTab";
import { LoginStack } from "./LoginStack";
import { LoginModal } from "@/components/common/modal/LoginModal";

export type ContainerStackParamList = {
  BottomTab: NavigatorScreenParams<BottomTabParamList>;
  LoginStack: undefined;
  Alarm: undefined;
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

  return (
    <NavigationContainer ref={navigationRef}>
      <LoginModal
        navigationRef={navigationRef}
        visible={showLoginModal}
        setVisible={setShowLoginModal}
      />

      <Stack.Navigator initialRouteName="BottomTab">
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Alarm"
          component={Alarm}
          options={{
            header: () => <CustomHeader title="알림" showBackButton />,
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
