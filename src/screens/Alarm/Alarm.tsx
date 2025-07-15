import { colors } from "@/styles";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export const Alarm = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text>알림</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: colors.white,
  },
});
