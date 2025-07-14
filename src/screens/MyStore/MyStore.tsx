import { StyleSheet, Text, View } from "react-native";

export const QrScan = () => {
  return (
    <View style={styles.container}>
      <Text>내 매장</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
