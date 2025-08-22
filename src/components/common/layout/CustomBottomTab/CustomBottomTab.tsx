import { SafeAreaView } from "react-native";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "@/styles";

export const CustomBottomTab = (props: BottomTabBarProps) => {
  return (
    <SafeAreaView style={{ backgroundColor: colors.white }}>
      <BottomTabBar {...props} />
    </SafeAreaView>
  );
};
