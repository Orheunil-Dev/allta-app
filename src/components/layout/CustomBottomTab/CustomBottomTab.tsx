import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "@/styles";
import { Platform } from "react-native";

export const CustomBottomTab = (props: BottomTabBarProps) => {
  return (
    <SafeAreaView
      edges={Platform.OS === "ios" ? ["bottom"] : []}
      style={{ backgroundColor: colors.white }}
    >
      <BottomTabBar {...props} />
    </SafeAreaView>
  );
};
