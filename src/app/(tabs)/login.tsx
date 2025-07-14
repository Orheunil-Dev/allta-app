import {
  useAuthControllerCheckUserBySocialId,
  useAuthControllerLoginBySocialId,
} from "@/api/auth/auth";
import {
  CheckUserBySocialIdDtoLoginKind,
  LoginBySocialIdDtoLoginKind,
} from "@/api/models";
import * as KakaoLogins from "@react-native-seoul/kakao-login";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  // 가입된 회원인지 체크
  const {
    mutate: checkUserMutate,
    data: checkUserData,
    error: checkUserError,
  } = useAuthControllerCheckUserBySocialId();

  // 소셜 로그인
  const {
    mutate: socialLoginMutate,
    data: socialLoginData,
    error: socialLoginError,
  } = useAuthControllerLoginBySocialId();

  const loginWithKakao = async () => {
    try {
      await KakaoLogins.login();
      const getProfile = await KakaoLogins.getProfile();

      checkUserMutate(
        {
          data: {
            loginKind: CheckUserBySocialIdDtoLoginKind.KAKAO,
            socialId: String(getProfile.id),
          },
        },
        {
          onSuccess(data, variables, context) {
            console.log(data);

            socialLoginMutate(
              {
                data: {
                  loginKind: LoginBySocialIdDtoLoginKind.KAKAO,
                  socialId: String(getProfile.id),
                },
              },
              {
                onError(error) {
                  console.log("에러 발생");
                },
              }
            );
          },
          onError(error) {
            console.log("에러 발생");
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.loginImage}>
          <Text>이미지 들어갈 예정</Text>
        </View>

        <View style={styles.kakaoLoginButton}>
          <Button title="카카오톡 로그인" onPress={() => loginWithKakao()} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
