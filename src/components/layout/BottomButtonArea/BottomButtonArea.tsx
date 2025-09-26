import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { ReactNode } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

interface Props {
  children: ReactNode;
}

const { width: screenWidth } = Dimensions.get("window");

export const BottomButtonArea = ({ children }: Props) => {
  return (
    <View style={styles.bottom}>
      <View style={styles.shadow} />

      <View style={styles.buttonArea}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: "relative",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingBottom: getResponsiveSize(10),
  },
  shadow: {
    position: "absolute",
    top: 0,
    width: screenWidth,
    height: getResponsiveSize(12),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 5,
  },
  buttonArea: {
    width: "100%",
    paddingTop: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
  },
});
