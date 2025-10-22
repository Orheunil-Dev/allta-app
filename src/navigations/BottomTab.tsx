import {
  getFocusedRouteNameFromRoute,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MyStoreStack, MyStoreStackParamList } from "./MyStoreStack";
import { getResponsiveSize } from "@/utils";
import { colors } from "@/styles";
import { CustomBottomTab } from "@/components/layout/CustomBottomTab";
import { Dimensions, Image, Platform } from "react-native";
import {
  blackHomeIcon,
  blackMyIcon,
  blackStoreIcon,
  scanIcon,
  whiteHomeIcon,
  whiteMyIcon,
  whiteStoreIcon,
} from "@/assets/images";
import { MyPageStack } from "./MyPageStack";
import { Home } from "@/screens/Home";
import { QrScanStack, QrScanStackParamList } from "./QrScanStack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type BottomTabParamList = {
  Home: undefined;
  QrScanStack: NavigatorScreenParams<QrScanStackParamList>;
  MyStoreStack: NavigatorScreenParams<MyStoreStackParamList>;
  MyPageStack: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const screenHeight = Dimensions.get("window").height;

export const BottomTab = () => {
  const insets = useSafeAreaInsets();

  const TAB_HEIGHT =
    screenHeight < 680 ? getResponsiveSize(70) : getResponsiveSize(30);

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTab {...props} />}
      screenOptions={{
        tabBarStyle: {
          height: TAB_HEIGHT + insets.bottom,
          backgroundColor: colors.white,
        },
        tabBarIconStyle: {
          marginTop: getResponsiveSize(4),
          marginBottom: getResponsiveSize(2),
        },
        tabBarLabelStyle: {
          fontSize: getResponsiveSize(13),
          fontWeight: "500",
          marginBottom: getResponsiveSize(4),
        },
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.gray7,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "홈",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? blackHomeIcon : whiteHomeIcon}
              style={{
                width: getResponsiveSize(24),
                height: getResponsiveSize(24),
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyStoreStack"
        component={MyStoreStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          const hideTabBar = routeName === "MyStoreDetail";

          return {
            title: "내 매장",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? blackStoreIcon : whiteStoreIcon}
                style={{
                  width: getResponsiveSize(24),
                  height: getResponsiveSize(24),
                }}
              />
            ),
            tabBarStyle: hideTabBar
              ? { display: "none" }
              : {
                  height: getResponsiveSize(30) + insets.bottom,
                  backgroundColor: colors.white,
                },
          };
        }}
      />
      <Tab.Screen
        name="QrScanStack"
        component={QrScanStack}
        options={{
          title: "QR 스캔",
          headerShown: false,
          tabBarIcon: () => (
            <Image
              source={scanIcon}
              style={{
                width: getResponsiveSize(24),
                height: getResponsiveSize(24),
              }}
            />
          ),
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="MyPageStack"
        component={MyPageStack}
        options={{
          title: "내 정보",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? blackMyIcon : whiteMyIcon}
              style={{
                width: getResponsiveSize(24),
                height: getResponsiveSize(24),
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
