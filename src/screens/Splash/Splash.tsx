import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { getResponsiveSize } from "@/utils";
import { splashIamge } from "@/assets/images";
import { useEffect, useState } from "react";

export const Splash = () => {
  const [visible, setVisible] = useState(false);

  const logoY = getResponsiveSize(80);

  const splashAnimatedStyle = useAnimatedStyle(() => {
    "worklet";

    return {
      marginTop: withTiming(visible ? 0 : logoY, {
        duration: 300,
      }),
      opacity: withTiming(visible ? 1 : 0, { duration: 300 }),
    };
  });

  useEffect(() => {
    setVisible(true);
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
