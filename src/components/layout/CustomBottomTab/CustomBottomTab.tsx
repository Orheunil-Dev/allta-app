import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "@/styles";

export const CustomBottomTab = (props: BottomTabBarProps) => {
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: colors.white }}>
      <BottomTabBar {...props} />
    </SafeAreaView>
  );
};
