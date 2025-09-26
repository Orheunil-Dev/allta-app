import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { z } from "zod";
import {
  useUserControllerCheckPhoneNumber,
  useUserControllerCreateUser,
  useUserControllerSendVerificationCode,
  useUserControllerVerifyPhoneNumber,
} from "@/api/user/user";
import { LoginStackParamList } from "@/navigations";
import {
  formatPhoneNumber,
  formatTime,
  getResponsiveSize,
  regexName,
  regexPhoneNumber,
} from "@/utils";
import { CustomError } from "@/types";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { SignUpTextInput } from "@/components/ui/TextInput";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { colors } from "@/styles";

type SignUpUserInfoRouteProp = RouteProp<LoginStackParamList, "SignUpUserInfo">;

// 유효성 검사
const signUpFormSchema = z.object({
  name: z.string().regex(regexName, "올바른 이름 형식이 아닙니다."),
  phoneNumber: z
    .string()
    .regex(regexPhoneNumber, "올바른 휴대폰 번호 형식이 아닙니다."),
});

export const SignUpUserInfo = () => {
  const route = useRoute<SignUpUserInfoRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef<NodeJS.Timeout | null>(null);

  const [isValid, setIsValid] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSended, setIsSended] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [seconds, setSeconds] = useState<number>(180);
  const [infoForm, setInfoForm] = useState({
    name: "",
    phoneNumber: "",
  });

  // 휴대폰 번호 중복 확인 API
  const {
    mutate: checkPhoneNumber,
    data: checkPhoneNumberData,
    isPending: checkPhoneNumberLoading,
    error: checkPhoneNumberError,
  } = useUserControllerCheckPhoneNumber();

  // 인증코드 발송 API
  const {
    mutate: sendVerificationCode,
    isPending: sendVerificationCodeLoading,
    error: sendVerificationCodeError,
  } = useUserControllerSendVerificationCode();

  // 인증코드 확인 API
  const {
    mutate: verifyPhoneNumber,
    isPending: verifyPhoneNumberLoading,
    error: verifyPhoneNumberError,
  } = useUserControllerVerifyPhoneNumber();

  // 회원가입
  const {
    mutate: createUser,
    isPending: createUserLoading,
    isError: createUserError,
  } = useUserControllerCreateUser();

  const handleChangeSignUpForm = (
    key: keyof typeof infoForm,
    value: string
  ) => {
    setInfoForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 인증코드 전송
  const handleSendVerificationCode = () => {
    sendVerificationCode(
      {
        data: {
          phoneNumber: infoForm.phoneNumber,
        },
      },
      {
        onSuccess: () => {
          setIsSended(true);
          setIsActive(true);
          setSeconds(180);
        },
      }
    );
  };

  const handleNext = () => {
    verifyPhoneNumber(
      {
        data: {
          phoneNumber: infoForm.phoneNumber,
          verificationCode,
        },
      },
      {
        onSuccess: () => {
          return loginStackNavigation.navigate("SignUpReferral", {
            ...route.params,
            ...infoForm,
          });
        },
      }
    );
  };

  // 휴대폰번호 입력 시 자동으로 검증 요청
  useEffect(() => {
    if (infoForm.phoneNumber.length !== 13) {
      setIsValid(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      checkPhoneNumber({
        data: {
          phoneNumber: infoForm.phoneNumber,
        },
      });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [infoForm.phoneNumber]);

  // 이름, 휴대폰 번호 입력 완료해야 인증코드 발송 가능
  useEffect(() => {
    if (infoForm.phoneNumber.length !== 13) {
      return;
    } else if (
      checkPhoneNumberData &&
      signUpFormSchema.safeParse(infoForm).success
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [checkPhoneNumberData, signUpFormSchema]);

  // 인증코드 타이머
  useEffect(() => {
    if (isActive && seconds > 0) {
      secondsRef.current = setTimeout(() => setSeconds(seconds - 1), 1000);
    }
    if (seconds === 0) {
      setIsActive(false);
    }
    return () => {
      if (secondsRef.current) {
        clearTimeout(secondsRef.current);
        secondsRef.current = null;
      }
    };
  }, [isActive, seconds]);

  // 인증코드 입력 완료 시 자동으로 검증 후 화면 이동
  useEffect(() => {
    if (verificationCode.length === 6) {
      handleNext();
    }
  }, [verificationCode]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <CustomText fontSize={24} fontWeight={"600"}>
              기본 정보를 입력해주세요.
            </CustomText>

            <CustomText fontSize={16} marginTop={32}>
              이름
            </CustomText>
            <SignUpTextInput
              value={infoForm.name}
              onChangeText={(text) => handleChangeSignUpForm("name", text)}
              placeholder="이름을 입력해주세요."
            />

            <CustomText fontSize={16} marginTop={32}>
              휴대폰 번호
            </CustomText>
            <View style={styles.inputBox}>
              <SignUpTextInput
                value={infoForm.phoneNumber}
                onChangeText={(value) =>
                  handleChangeSignUpForm(
                    "phoneNumber",
                    formatPhoneNumber(value)
                  )
                }
                errorMessage={
                  infoForm.phoneNumber.length === 13
                    ? (checkPhoneNumberError as CustomError)?.message ??
                      undefined
                    : undefined
                }
                maxLength={13}
                keyboardType="number-pad"
                placeholder="휴대폰 번호를 입력해주세요."
              />
              <Pressable
                onPress={handleSendVerificationCode}
                disabled={!isValid}
                style={[
                  styles.sendCodeButton,
                  {
                    borderColor: isValid ? colors.main : colors.gray5,
                  },
                ]}
              >
                <CustomText
                  color={isValid ? colors.main : colors.gray5}
                  fontSize={12}
                  fontWeight={"500"}
                  textAlign="center"
                >
                  {isSended ? "인증번호 재전송" : "인증번호 받기"}
                </CustomText>
              </Pressable>
            </View>

            {isSended && (
              <>
                <CustomText fontSize={16} marginTop={32}>
                  인증번호
                </CustomText>
                <View style={styles.inputBox}>
                  <SignUpTextInput
                    value={verificationCode}
                    onChangeText={(text) => setVerificationCode(text)}
                    maxLength={6}
                    keyboardType="number-pad"
                    errorMessage={
                      !seconds
                        ? "인증시간이 만료되었습니다."
                        : (verifyPhoneNumberError as CustomError)?.message ??
                          undefined
                    }
                    placeholder="인증번호 6자리"
                  />

                  <View style={styles.timer}>
                    <CustomText>{formatTime(seconds)}</CustomText>
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          <CustomButton
            onPress={handleNext}
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
