import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommonActions, useNavigation } from "@react-navigation/native";
import CookieManager from "@react-native-cookies/cookies";
import * as SecureStore from "expo-secure-store";
import * as KakaoLogins from "@react-native-seoul/kakao-login";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import { jwtDecode } from "jwt-decode";
import { ContainerStackParamList, LoginStackParamList } from "@/navigations";
import {
  useAuthControllerCheckUserBySocialId,
  useAuthControllerLoginBySocialId,
} from "@/api/auth/auth";
import { getResponsiveSize } from "@/utils";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import {
  appleLoginIcon,
  closeIcon,
  googleLoginIcon,
  kakaoLoginIcon,
} from "@/assets/images";
import { colors } from "@/styles";

export const Login = () => {
  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_ID,
  });

  const {
    mutate: checkSocialId,
    isPending: checkSocialIdLoading,
    isError: checkSocialIdError,
  } = useAuthControllerCheckUserBySocialId();

  const {
    mutate: loginBySocialId,
    isPending: loginBySocialIdLoading,
    isError: loginBySocialIdError,
  } = useAuthControllerLoginBySocialId();

  // 카카오 로그인
  const handleLoginKakao = async () => {
    try {
      await KakaoLogins.login();
      const profile = await KakaoLogins.getProfile();
      const socialId = String(profile.id);
      const email = profile.email;

      checkSocialId(
        {
          data: {
            loginKind: "KAKAO",
            socialId,
          },
        },
        {
          onSuccess: (res) => {
            if (!res.ok) {
              loginStackNavigation.navigate("SignUpTerms", {
                loginKind: "KAKAO",
                socialId,
                email,
              });
            } else {
              loginBySocialId(
                {
                  data: {
                    loginKind: "KAKAO",
                    socialId,
                  },
                },
                {
                  onSuccess: async (res) => {
                    const cookies = await CookieManager.get(
                      process.env.EXPO_PUBLIC_API_URL!
                    );

                    const accessToken = cookies.accessToken.value;
                    const refreshToken = cookies.refreshToken.value;

                    await SecureStore.setItemAsync("accessToken", accessToken);
                    await SecureStore.setItemAsync(
                      "refreshToken",
                      refreshToken
                    );

                    containerNavigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          {
                            name: "BottomTab",
                            params: { screen: "Home" },
                          },
                        ],
                      })
                    );
                  },
                  onError: (error: any) => {
                    console.log(error);
                    Alert.alert("로그인 중 에러가 발생했습니다.");
                  },
                }
              );
            }
          },
          onError: (error: any) => {
            console.log(error);
            Alert.alert("로그인 중 에러가 발생했습니다.");
          },
        }
      );
    } catch (error: any) {
      console.log(error);
      Alert.alert("로그인 중 에러가 발생했습니다.");
    }
  };

  // 구글 로그인
  const handleLoginGoogle = async () => {
    try {
      const result = await promptAsync();

      if (result.type === "success") {
        const accessToken = result.authentication?.accessToken;

        if (!accessToken) throw new Error("로그인 중 에러가 발생했습니다.");

        const profileRes = await fetch(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const profile = await profileRes.json();

        const socialId = String(profile.id);
        const email = profile.email;

        checkSocialId(
          {
            data: { loginKind: "GOOGLE", socialId },
          },
          {
            onSuccess: (res) => {
              if (!res.ok) {
                loginStackNavigation.navigate("SignUpTerms", {
                  loginKind: "GOOGLE",
                  socialId,
                  email,
                });
              } else {
                loginBySocialId(
                  {
                    data: { loginKind: "GOOGLE", socialId },
                  },
                  {
                    onSuccess: async (res) => {
                      const cookies = await CookieManager.get(
                        process.env.EXPO_PUBLIC_API_URL!
                      );

                      const accessToken = cookies.accessToken?.value;
                      const refreshToken = cookies.refreshToken?.value;

                      if (accessToken && refreshToken) {
                        await SecureStore.setItemAsync(
                          "accessToken",
                          accessToken
                        );
                        await SecureStore.setItemAsync(
                          "refreshToken",
                          refreshToken
                        );
                      }

                      containerNavigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [
                            {
                              name: "BottomTab",
                              params: { screen: "Home" },
                            },
                          ],
                        })
                      );
                    },
                    onError: (error: any) =>
                      Alert.alert("Error", error.message),
                  }
                );
              }
            },
            onError: (error: any) => {
              console.log(error);
              Alert.alert("로그인 중 에러가 발생했습니다.");
            },
          }
        );
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert("로그인 중 에러가 발생했습니다.");
    }
  };

  // 애플 로그인
  const handleLoginApple = async () => {
    try {
      const data = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!data.identityToken) return;

      const payload: any = jwtDecode(data.identityToken);

      checkSocialId(
        {
          data: {
            loginKind: "APPLE",
            socialId: data.user,
          },
        },
        {
          onSuccess: (res) => {
            if (!res.ok) {
              loginStackNavigation.navigate("SignUpTerms", {
                loginKind: "APPLE",
                socialId: data.user,
                email: payload.email,
              });
            } else {
              loginBySocialId(
                {
                  data: {
                    loginKind: "APPLE",
                    socialId: data.user,
                  },
                },
                {
                  onSuccess: async (res) => {
                    const cookies = await CookieManager.get(
                      process.env.EXPO_PUBLIC_API_URL!
                    );

                    const accessToken = cookies.accessToken.value;
                    const refreshToken = cookies.refreshToken.value;

                    await SecureStore.setItemAsync("accessToken", accessToken);
                    await SecureStore.setItemAsync(
                      "refreshToken",
                      refreshToken
                    );

                    containerNavigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          {
                            name: "BottomTab",
                            params: { screen: "Home" },
                          },
                        ],
                      })
                    );
                  },
                  onError: (error: any) => {
                    console.log(error);
                    Alert.alert("로그인 중 에러가 발생했습니다.");
                  },
                }
              );
            }
          },
          onError: (error: any) => {
            console.log(error);
            Alert.alert("로그인 중 에러가 발생했습니다.");
          },
        }
      );
    } catch (error: any) {
      console.log(error);
      Alert.alert("로그인 중 에러가 발생했습니다.");
    }
  };

  const handlePressClose = () => {
    containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "BottomTab",
            params: { screen: "Home" },
          },
        ],
      })
    );
  };

  return (
    <CustomSafeAreaView edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Pressable onPress={handlePressClose} style={styles.closeButton}>
          <Image
            source={closeIcon}
            style={{
              width: getResponsiveSize(28),
              height: getResponsiveSize(28),
            }}
          />
        </Pressable>

        <CustomText fontSize={24} fontWeight={"700"}>
          올타와 함께
        </CustomText>
        <CustomText marginTop={6} fontSize={24} fontWeight={"700"}>
          세차를 시작하세요!
        </CustomText>

        <View style={styles.image}>
          <CustomText>이미지 들어갈 자리</CustomText>
        </View>
        {/* 카카오 로그인 */}
        <CustomButton
          onPress={handleLoginKakao}
          width="100%"
          marginTop={32}
          backgroundColor="#FEE500"
        >
          <Image
            source={kakaoLoginIcon}
            style={{
              width: getResponsiveSize(18),
              height: getResponsiveSize(18),
              marginRight: getResponsiveSize(10),
            }}
          />
          <CustomText fontSize={15} fontWeight={"500"}>
            카카오로 로그인
          </CustomText>
        </CustomButton>

        {/* 구글 로그인 */}
        <CustomButton
          onPress={handleLoginGoogle}
          width="100%"
          marginTop={getResponsiveSize(12)}
          backgroundColor={colors.white}
          borderColor={colors.gray2}
        >
          <Image
            source={googleLoginIcon}
            style={{
              width: getResponsiveSize(18),
              height: getResponsiveSize(18),
              marginRight: getResponsiveSize(10),
            }}
          />
          <Text
            style={{
              fontFamily: "Roboto-Light",
              fontSize: getResponsiveSize(15),
            }}
          >
            구글 계정으로 로그인
          </Text>
        </CustomButton>

        {/* 애플 로그인 */}
        {Platform.OS === "ios" && (
          <CustomButton
            onPress={handleLoginApple}
            width="100%"
            marginTop={getResponsiveSize(12)}
            backgroundColor="#141414"
          >
            <Image
              source={appleLoginIcon}
              style={{
                width: getResponsiveSize(18),
                height: getResponsiveSize(18),
                marginRight: getResponsiveSize(10),
              }}
            />
            <CustomText color={colors.white} fontSize={15} fontWeight={"500"}>
              Apple로 로그인
            </CustomText>
          </CustomButton>
        )}
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(40),
    backgroundColor: colors.white,
  },
  closeButton: {
    position: "absolute",
    top: getResponsiveSize(20),
    right: getResponsiveSize(20),
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
    width: getResponsiveSize(204),
    height: getResponsiveSize(204),
    marginTop: getResponsiveSize(16),
    backgroundColor: colors.main,
  },
});
