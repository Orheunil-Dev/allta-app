import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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
import * as SecureStore from "expo-secure-store";
import {
  useUserControllerCreateUser,
  useUserControllerVerifyRefferalCode,
} from "@/api/user/user";
import { useAuthControllerLoginBySocialId } from "@/api/auth/auth";
import { getResponsiveSize } from "@/utils";
import { CustomError } from "@/types";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { SignUpTextInput } from "@/components/ui/TextInput";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { colors } from "@/styles";

type SignUpReferralRouteProp = RouteProp<LoginStackParamList, "SignUpReferral">;

export const SignUpReferral = () => {
  const route = useRoute<SignUpReferralRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [referralCode, setReferralCode] = useState("");
  const [isValid, setIsValid] = useState(false);

  // 추천인 코드 검증
  const {
    data: verifyReferralCodeData,
    refetch: fetchVerifyReferralCode,
    isFetching: verifyReferralCodeLoading,
    error: verifyReferralCodeError,
  } = useUserControllerVerifyRefferalCode(
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

  // 회원가입
  const {
    mutate: createUser,
    isPending: createUserLoading,
    isError: createUserError,
  } = useUserControllerCreateUser();

  // 로그인
  const {
    mutate: loginBySocialId,
    isPending: loginBySocialIdLoading,
    isError: loginBySocialIdError,
  } = useAuthControllerLoginBySocialId();

  // 회원가입 완료
  const handleSignUp = () => {
    createUser(
      {
        data: {
          ...route.params,
          ...(isValid ? { referrerCode: referralCode } : {}),
        },
      },
      {
        onSuccess: () => {
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

                loginStackNavigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "SignUpComplete" }],
                  })
                );
              },
              onError: (err) => {
                console.log(err);
              },
            }
          );
        },
        onError: (err) => {
          console.log(err);
        },
      }
    );
  };

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
            <SignUpTextInput
              value={referralCode}
              onChangeText={(text) => setReferralCode(text)}
              maxLength={6}
              errorMessage={
                (verifyReferralCodeError as CustomError)?.message ?? undefined
              }
              placeholder="추천인 코드 6자리를 입력해주세요."
            />
          </ScrollView>

          <Pressable onPress={handleSignUp}>
            <CustomText
              color={colors.gray7}
              fontSize={16}
              textAlign="center"
              marginBottom={16}
            >
              건너뛰기
            </CustomText>
          </Pressable>

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
