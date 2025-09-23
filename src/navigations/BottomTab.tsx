import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { QrStack } from "./QrStack";
import { MyStoreStack } from "./MyStoreStack";
import { getResponsiveSize } from "@/utils";
import { colors } from "@/styles";
import { CustomBottomTab } from "@/components/layout/CustomBottomTab";
import { Image, Platform } from "react-native";
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

export type BottomTabParamList = {
  Home: undefined;
  QrStack: undefined;
  MyStoreStack: undefined;
  MyPageStack: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTab = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTab {...props} />}
      screenOptions={{
        tabBarStyle: {
          height:
            Platform.OS === "ios"
              ? getResponsiveSize(60)
              : getResponsiveSize(90),
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
        options={{
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
        }}
      />
      <Tab.Screen
        name="QrStack"
        component={QrStack}
        options={{
          title: "QR 스캔",
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
