import { Image, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { getResponsiveSize } from "@/utils";
import { splashIamge } from "@/assets/images";
import { useEffect, useState } from "react";

export const Splash = () => {
  const [visible, setVisible] = useState(false);

  const splashAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: withTiming(visible ? 0 : getResponsiveSize(80), {
        duration: 300,
      }),
      opacity: withTiming(visible ? 1 : 0, { duration: 300 }),
    };
  });

  useEffect(() => {
    setVisible(true); // 마운트되면 opacity 0 → 1
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={splashIamge}
        style={[
          {
            width: getResponsiveSize(154),
            height: getResponsiveSize(233),
          },
          splashAnimatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
});
