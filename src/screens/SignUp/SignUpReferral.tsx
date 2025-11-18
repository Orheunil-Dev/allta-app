import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@/navigations";
import CookieManager from "@react-native-cookies/cookies";
import analytics from "@react-native-firebase/analytics";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { useReferralControllerVerifyReferralCode } from "@/api/referral/referral";
import {
  useUserControllerCheckIsRejoin,
  useUserControllerCreateUser,
} from "@/api/user/user";
import { useAuthControllerLoginBySocialId } from "@/api/auth/auth";
import { getResponsiveSize } from "@/utils";
import { CustomError } from "@/types";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { colors } from "@/styles";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import mmkvStorage from "@/libs/mmkv-storage";
import { IS_COUPON_RECEIVED } from "@/constants";
import axios from "axios";

type SignUpReferralRouteProp = RouteProp<LoginStackParamList, "SignUpReferral">;

export const SignUpReferral = () => {
  const route = useRoute<SignUpReferralRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const insets = useSafeAreaInsets();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [referralCode, setReferralCode] = useState("");
  const [isValid, setIsValid] = useState(false);

  // 재가입 여부 조회 API
  const {
    data: checkIsRejoinData,
    isFetching: checkIsRejoinLoading,
    error: checkIsRejoinError,
  } = useUserControllerCheckIsRejoin({
    loginKind: route.params.loginKind,
    socialId: route.params.socialId,
    phoneNumber: route.params.phoneNumber,
  });

  // 추천인 코드 검증 API
  const {
    data: verifyReferralCodeData,
    refetch: fetchVerifyReferralCode,
    isFetching: verifyReferralCodeLoading,
    error: verifyReferralCodeError,
  } = useReferralControllerVerifyReferralCode(
    {
      referralCode,
    },
    {
      query: {
        enabled: false,
        retry: false,
        gcTime: 0,
      },
    }
  );

  // 회원가입 API
  const {
    mutate: createUser,
    isPending: createUserLoading,
    isError: createUserError,
  } = useUserControllerCreateUser();

  // 로그인 API
  const {
    mutate: loginBySocialId,
    isPending: loginBySocialIdLoading,
    isError: loginBySocialIdError,
  } = useAuthControllerLoginBySocialId();

  // 회원가입
  const handleSignUp = async () => {
    let lat: number | undefined = undefined;
    let lng: number | undefined = undefined;
    let address: string | undefined = undefined;

    try {
      // 위치 권한 요청
      let { status, canAskAgain } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted" && canAskAgain) {
        const res = await Location.requestForegroundPermissionsAsync();
        status = res.status;
      }

      // 권한 허용된 경우만 위치 정보 가져오기
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        lat = loc.coords.latitude;
        lng = loc.coords.longitude;

        console.log(lat, lng);

        // 좌표 -> 주소 변환
        const kakaoRes = await axios.get(
          "https://dapi.kakao.com/v2/local/geo/coord2address.json",
          {
            headers: {
              Authorization:
                "KakaoAK " + process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY,
            },
            params: { x: lng, y: lat },
          }
        );

        address = kakaoRes.data.documents[0]?.address?.address_name;
      }
    } catch (error) {}

    createUser(
      {
        data: {
          ...route.params,
          ...(address ? { address } : {}),
          ...(isValid ? { referrerCode: referralCode } : {}),
        },
      },
      {
        onSuccess: async (res) => {
          const isRejoined = res.isRejoined;
          const isCouponReceived = res.isCouponReceived;

          await analytics().logEvent("sign_up_complete", {
            platform: Platform.OS,
            is_rejoined: isRejoined,
            coupon_received: isCouponReceived,
          });

          loginBySocialId(
            {
              data: {
                loginKind: route.params.loginKind,
                socialId: route.params.socialId,
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
                await SecureStore.setItemAsync("refreshToken", refreshToken);

                mmkvStorage.setBoolean(IS_COUPON_RECEIVED, isCouponReceived);

                loginStackNavigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "SignUpComplete",
                        params: {
                          isRejoined,
                        },
                      },
                    ],
                  })
                );
              },
              onError: (error: any) => {
                setErrorModal({
                  visible: true,
                  message: error?.message ?? "로그인에 실패했습니다.",
                });
              },
            }
          );
        },
        onError: (error: any) => {
          setErrorModal({
            visible: true,
            message: error?.message ?? "회원가입에 실패했습니다.",
          });
        },
      }
    );
  };

  // 재가입 회원일 경우 바로 회원가입 요청
  useEffect(() => {
    if (checkIsRejoinData && checkIsRejoinData.isRejoin) {
      handleSignUp();
    }
  }, [checkIsRejoinData]);

  // 추천인 코드 6자 입력 시 자동으로 검증 요청
  useEffect(() => {
    if (referralCode.length !== 6) {
      setIsValid(false);
      return;
    }

    // 이전 타이머 제거
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // 새 타이머 설정
    debounceRef.current = setTimeout(() => {
      fetchVerifyReferralCode();
    }, 500);

    // 컴포넌트 언마운트 시 타이머 클리어
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [referralCode]);

  useEffect(() => {
    if (referralCode.length !== 6) {
      return;
    } else if (verifyReferralCodeData?.ok) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [verifyReferralCodeData, referralCode]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <CustomText fontSize={24} fontWeight={"600"}>
              추천인 코드를 입력해주세요.
            </CustomText>

            <CustomText fontSize={16} marginTop={32}>
              추천인 코드
            </CustomText>
            <CustomTextInput
              value={referralCode}
              onChangeText={(text) => setReferralCode(text)}
              maxLength={6}
              errorMessage={
                (verifyReferralCodeError as CustomError)?.message ?? undefined
              }
              placeholder="추천인 코드 6자리를 입력해주세요."
            />
          </ScrollView>

          <CustomButton
            onPress={handleSignUp}
            isDisabled={!isValid}
            height={getResponsiveSize(53)}
            backgroundColor={isValid ? colors.main : colors.gray2}
          >
            <CustomText
              color={isValid ? colors.white : colors.gray5}
              fontSize={16}
              fontWeight={"600"}
            >
              다음
            </CustomText>
          </CustomButton>
        </View>
      </CustomKeyboardAvoidingView>

      <Pressable
        onPress={handleSignUp}
        style={{
          position: "absolute",
          bottom: insets.bottom + getResponsiveSize(60),
          alignSelf: "center",
        }}
      >
        <CustomText
          color={colors.gray7}
          fontSize={16}
          textAlign="center"
          marginBottom={16}
        >
          건너뛰기
        </CustomText>
      </Pressable>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(10),
  },
  inputBox: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  sendCodeButton: {
    justifyContent: "center",
    alignSelf: "center",
    width: getResponsiveSize(90),
    height: getResponsiveSize(24),
    marginLeft: getResponsiveSize(12),
    borderWidth: 1,
    borderRadius: 15,
  },
  timer: {
    position: "absolute",
    right: getResponsiveSize(10),
  },
});
