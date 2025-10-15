import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors } from "@/styles";

export const CustomBottomTab = (props: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      edges={[]}
      style={{
        paddingBottom: props.state.index === 2 ? 0 : insets.bottom,
        backgroundColor: colors.white,
      }}
    >
      <BottomTabBar {...props} />
    </SafeAreaView>
  );
};
