import {
  NavigationContainer,
  NavigatorScreenParams,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alarm } from "@/screens/Alarm";
import { CustomHeader } from "@/components/common/layout/CustomHeader";
import { BottomTab, BottomTabParamList } from "./BottomTab";

export type ContainerStackParamList = {
  BottomTab: NavigatorScreenParams<BottomTabParamList>;
  Alarm: undefined;
};

const Stack = createNativeStackNavigator();

export const ContainerStack = () => {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
