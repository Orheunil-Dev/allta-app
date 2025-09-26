import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "@/styles";
import { Platform, StyleSheet, View } from "react-native";
import { getResponsiveSize } from "@/utils";

export const CustomBottomTab = (props: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={Platform.OS === "ios" ? [] : []}
      style={{ paddingBottom: insets.bottom, backgroundColor: colors.white }}
    >
      <BottomTabBar {...props} />
    </SafeAreaView>
  );
};
