import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@/navigations";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { CustomButton } from "@/components/ui/CustomButton";
import { getResponsiveSize, regexName, regexPhoneNumber } from "@/utils";
import { SignUpTextInput } from "@/components/ui/TextInput";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import {
  useAuthControllerCheckPhoneNumberExists,
  useAuthControllerSendVerificationCode,
  useAuthControllerVerifyPhoneNumber,
} from "@/api/auth/auth";

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
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    phoneNumber: "",
  });

  // 휴대폰 번호 중복 확인 API
  const {
    mutate: checkPhoneNumberExists,
    data: checkPhoneNumberExistsData,
    isPending: checkPhoneNumberExistsLoading,
    error: checkPhoneNumberExistsError,
  } = useAuthControllerCheckPhoneNumberExists();

  // 인증코드 발송 API
  const {
    mutate: sendVerificationCode,
    data: sendVerificationCodeData,
    isPending: sendVerificationCodeLoading,
    error: sendVerificationCodeError,
  } = useAuthControllerSendVerificationCode();

  // 인증코드 확인 API
  const {
    mutate: verifyPhoneNumber,
    data: verifyPhoneNumberData,
    isPending: verifyPhoneNumberLoading,
    error: verifyPhoneNumberError,
  } = useAuthControllerVerifyPhoneNumber();

  const handleChangeSignUpForm = (
    key: keyof typeof signUpForm,
    value: string
  ) => {
    setSignUpForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 전화번호 포맷팅 (ex. 010-1234-5678)
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  //시간 포맷팅 (ex. 03:00)
  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `0${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  // 인증코드 전송
  const handleSendVerificationCode = () => {
    sendVerificationCode(
      {
        data: {
          phoneNumber: signUpForm.phoneNumber,
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

  // 휴대폰번호 입력 시 자동으로 검증 요청
  useEffect(() => {
    if (signUpForm.phoneNumber.length !== 13) {
      setIsValid(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      checkPhoneNumberExists({
        data: {
          phoneNumber: signUpForm.phoneNumber,
        },
      });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [signUpForm.phoneNumber]);

  // 이름, 휴대폰 번호 입력 완료해야 인증코드 발송 가능
  useEffect(() => {
    if (signUpForm.phoneNumber.length !== 13) {
      return;
    } else if (
      checkPhoneNumberExistsData &&
      signUpFormSchema.safeParse(signUpForm).success
    ) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [checkPhoneNumberExistsData, signUpFormSchema]);

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
      verifyPhoneNumber(
        {
          data: {
            phoneNumber: signUpForm.phoneNumber,
            verificationCode,
          },
        },
        {
          onSuccess: () => {
            return loginStackNavigation.navigate("SignUpCarRegist", {
              ...route.params,
              name: signUpForm.name,
              phoneNumber: signUpForm.phoneNumber,
            });
          },
        }
      );
    }
  }, [verificationCode]);

  return (
    <SafeAreaView style={styles.safeArea}>
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
              value={signUpForm.name}
              onChangeText={(text) => handleChangeSignUpForm("name", text)}
              placeholder="이름을 입력해주세요."
            />

            <CustomText fontSize={16} marginTop={32}>
              휴대폰 번호
            </CustomText>
            <View style={styles.inputBox}>
              <SignUpTextInput
                value={signUpForm.phoneNumber}
                onChangeText={(text) =>
                  handleChangeSignUpForm("phoneNumber", formatPhoneNumber(text))
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
                        : String(verifyPhoneNumberError)
                    }
                    placeholder="인증번호 6자리"
                  />

                  <View style={styles.timer}>
                    <CustomText>{formatTime()}</CustomText>
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          <CustomButton
            onPress={() => {}}
            isDisabled={!isValid}
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
    </SafeAreaView>
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
