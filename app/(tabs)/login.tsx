import { Button, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginImage}>
        <Text>이미지 들어갈 예정</Text>
      </View>

      <View style={styles.kakaoLoginButton}>
        <Button
          title="카카오톡 로그인"
          onPress={() => alert("로그인 버튼 클릭")}
        />
      </View>
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
