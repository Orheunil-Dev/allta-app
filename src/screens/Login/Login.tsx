import {
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
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { ContainerStackParamList, LoginStackParamList } from "@/navigations";
import {
  useAuthControllerAppleLoginCallback,
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
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import * as AppleAuthentication from "expo-apple-authentication";
import { jwtDecode } from "jwt-decode";
import { useVideoPlayer, VideoView } from "expo-video";

export const Login = () => {
  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const setErrorModal = useSetAtom(errorModalAtom);

  // 소셜 로그인
  const {
    mutate: loginBySocialId,
    isPending: loginBySocialIdLoading,
    isError: loginBySocialIdError,
  } = useAuthControllerLoginBySocialId();

  // 애플 로그인
  const {
    mutate: appleLoginCallback,
    isPending: appleLoginCallbackLoading,
    isError: appleLoginCallbackError,
  } = useAuthControllerAppleLoginCallback();

  const player = useVideoPlayer(
    require("@/assets/video/login-video.mp4"),
    (player) => {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  );

  // 카카오 로그인
  const handleLoginKakao = async () => {
    try {
      const KAKAO_REDIRECT_URI = `${process.env.EXPO_PUBLIC_API_URL}/auth/kakao`;
      const KAKAO_CLIENT_ID = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;
      const redirectUri = Linking.createURL("");

      try {
        const result = await WebBrowser.openAuthSessionAsync(
          `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`,
          redirectUri
        );

        if (result.type === "success") {
          const { queryParams } = Linking.parse(result.url);

          const socialId = queryParams?.socialId;
          const email = queryParams?.email;
          const message = queryParams?.message;

          // 기존 회원
          if (queryParams?.ok === "true") {
            loginBySocialId(
              {
                data: { socialId: socialId as string, loginKind: "KAKAO" },
              },
              {
                onSuccess: async () => {
                  const cookies = await CookieManager.get(
                    process.env.EXPO_PUBLIC_API_URL
                  );

                  const accessToken = cookies.accessToken.value;
                  const refreshToken = cookies.refreshToken.value;

                  await SecureStore.setItemAsync("accessToken", accessToken);
                  await SecureStore.setItemAsync("refreshToken", refreshToken);

                  return containerNavigation.dispatch(
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
              }
            );
          } else if (socialId) {
            return loginStackNavigation.navigate("SignUpTerms", {
              loginKind: "KAKAO",
              socialId: socialId as string,
              email: email as string,
            });
          } else {
            setErrorModal({
              visible: true,
              message: message ? (message as string) : "로그인에 실패했습니다.",
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 구글 로그인
  const handleLoginGoogle = async () => {
    try {
      const GOOGLE_REDIRECT_URI = `${process.env.EXPO_PUBLIC_API_URL}/auth/google`;
      const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
      const redirectUri = Linking.createURL("");

      try {
        const result = await WebBrowser.openAuthSessionAsync(
          `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&access_type=offline&state=1234_purpleGoogle&prompt=consent`,
          redirectUri
        );

        if (result.type === "success") {
          const { queryParams } = Linking.parse(result.url);

          const socialId = queryParams?.socialId;
          const email = queryParams?.email;
          const message = queryParams?.message;

          if (queryParams?.ok === "true") {
            loginBySocialId(
              {
                data: { socialId: socialId as string, loginKind: "GOOGLE" },
              },
              {
                onSuccess: async () => {
                  const cookies = await CookieManager.get(
                    process.env.EXPO_PUBLIC_API_URL
                  );

                  const accessToken = cookies.accessToken.value;
                  const refreshToken = cookies.refreshToken.value;

                  await SecureStore.setItemAsync("accessToken", accessToken);
                  await SecureStore.setItemAsync("refreshToken", refreshToken);

                  return containerNavigation.dispatch(
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
              }
            );
          } else if (socialId) {
            return loginStackNavigation.navigate("SignUpTerms", {
              loginKind: "GOOGLE",
              socialId: socialId as string,
              email: email as string,
            });
          } else {
            setErrorModal({
              visible: true,
              message: message ? (message as string) : "로그인에 실패했습니다.",
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
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

      appleLoginCallback(
        {
          data: {
            loginKind: "APPLE",
            socialId: data.user,
            email: data.email,
          },
        },
        {
          onSuccess: async (res: any) => {
            if (!res) return;

            if (res.ok) {
              const cookies = await CookieManager.get(
                process.env.EXPO_PUBLIC_API_URL
              );

              const accessToken = cookies.accessToken.value;
              const refreshToken = cookies.refreshToken.value;

              await SecureStore.setItemAsync("accessToken", accessToken);
              await SecureStore.setItemAsync("refreshToken", refreshToken);

              return containerNavigation.dispatch(
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
            } else {
              return loginStackNavigation.navigate("SignUpTerms", {
                loginKind: "APPLE",
                socialId: data.user,
                email: data.email,
              });
            }
          },
        }
      );
    } catch (error: any) {
      setErrorModal({
        visible: true,
        message: error?.message ?? "로그인에 실패했습니다.",
      });
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

        <VideoView
          style={styles.video}
          player={player}
          nativeControls={false}
        />

        {/* 카카오 로그인 */}
        <CustomButton
          onPress={handleLoginKakao}
          width="100%"
          marginTop={32}
          backgroundColor="#FEE500"
          borderRadius={12}
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
          borderWidth={1}
          borderColor={colors.gray2}
          borderRadius={12}
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
              fontFamily: "Roboto-Medium",
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
            borderRadius={12}
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
  video: {
    justifyContent: "center",
    alignItems: "center",
    width: getResponsiveSize(204),
    height: getResponsiveSize(204),
    marginTop: getResponsiveSize(16),
    marginRight: getResponsiveSize(20),
  },
});
