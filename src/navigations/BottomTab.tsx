import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeStack } from "./HomeStack";
import { QrStack } from "./QrStack";
import { MyStoreStack } from "./MyStoreStack";
import { ProfileStack } from "./ProfileStack";

export type BottomTabParamList = {
  HomeStack: undefined;
  QrStack: undefined;
  MyStoreStack: undefined;
  ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTab = () => {
  return (
    <Tab.Navigator detachInactiveScreens={false}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: "홈",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="QrStack"
        component={QrStack}
        options={{
          title: "QR 스캔",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="MyStoreStack"
        component={MyStoreStack}
        options={{
          title: "내 매장",
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          title: "내 정보",
        }}
      />
    </Tab.Navigator>
  );
};
