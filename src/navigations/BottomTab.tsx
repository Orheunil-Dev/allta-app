import { Home } from "@/screens/Home/Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MyStoreStack, ProfileStack, QrStack } from ".";

const Tab = createBottomTabNavigator();

export const BottomTab = () => {
  return (
    <Tab.Navigator detachInactiveScreens={false}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "홈",
        }}
      />
      <Tab.Screen
        name="OfferStack"
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
