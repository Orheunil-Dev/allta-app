import { StyleSheet, View } from "react-native";
import { colors } from "@/styles";

export const Empty = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.white,
  },
});
