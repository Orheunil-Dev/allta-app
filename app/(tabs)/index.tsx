import { StyleSheet, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>홈</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  loginImage: {
    width: 200,
    height: 200,
    marginBottom: 40,
    backgroundColor: "#F3F3F3",
  },
  kakaoLoginButton: {
    width: "80%",
    backgroundColor: "#FAE100",
  },
});
