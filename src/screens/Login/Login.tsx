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
import * as KakaoLogins from "@react-native-seoul/kakao-login";
import CookieManager from "@react-native-cookies/cookies";
import * as SecureStore from "expo-secure-store";
import { ContainerStackParamList, LoginStackParamList } from "@/navigations";
import {
  useAuthControllerCheckUserBySocialId,
  useAuthControllerLoginBySocialId,
} from "@/api/auth/auth";
import { getResponsiveSize } from "@/utils";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import {
  appleLoginIcon,
  closeIcon,
  googleLoginIcon,
  kakaoLoginIcon,
} from "@/assets/images";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";

export const Login = () => {
  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

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
                    const cookies = await CookieManager.getAll();

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
                            params: { screen: "HomeStack" },
                          },
                        ],
                      })
                    );
                  },
                  onError: (error: any) => {
                    Alert.alert("Error", error.message);
                  },
                }
              );
            }
          },
          onError: (error: any) => {
            console.log(error);

            Alert.alert("Error", error.message);
          },
        }
      );
    } catch {}
  };

  const handlePressClose = () => {
    containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "BottomTab",
            params: { screen: "HomeStack" },
          },
        ],
      })
    );
  };

  return (
    <CustomSafeAreaView>
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
          width="100%"
          marginTop={32}
          onPress={handleLoginKakao}
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
  safeArea: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
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
    top: 0,
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
