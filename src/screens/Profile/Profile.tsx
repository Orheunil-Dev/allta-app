import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { z } from "zod";
import {
  useUserControllerCheckPhoneNumber,
  useUserControllerSendVerificationCode,
  useUserControllerUpdateUserProfile,
  useUserControllerVerifyPhoneNumber,
} from "@/api/user/user";
import { ContainerStackParamList } from "@/navigations";
import { errorModalAtom } from "@/jotai";
import { useToastMessage } from "@/hooks";
import {
  formatLoginKind,
  formatPhoneNumber,
  formatTime,
  getResponsiveSize,
  regexName,
  regexPhoneNumber,
} from "@/utils";
import { CustomError } from "@/types";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import { Spinner } from "@/components/ui/Spinner";
import { colors } from "@/styles";

type ProfileRouteProp = RouteProp<ContainerStackParamList, "Profile">;

// 유효성 검사
const nameSchema = z.object({
  name: z
    .string()
    .min(2, "이름은 최소 2자 이상 입력해주세요.")
    .max(10, "이름은 최대 10자까지 입력해주세요.")
    .regex(regexName, "올바른 이름 형식이 아닙니다."),
});

const phoneNumberSchema = z.object({
  phoneNumber: z
    .string()
    .regex(regexPhoneNumber, "올바른 휴대폰 번호 형식이 아닙니다."),
});

export const Profile = () => {
  const route = useRoute<ProfileRouteProp>();

  const queryClient = useQueryClient();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const scrollRef = useRef<ScrollView>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef<NodeJS.Timeout | null>(null);

  const setErrorModal = useSetAtom(errorModalAtom);

  const [isValid, setIsValid] = useState<boolean>(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isSended, setIsSended] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [seconds, setSeconds] = useState<number>(180);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    phoneNumber: string;
  }>({
    name: route.params.name,
    phoneNumber: route.params.phoneNumber,
  });

  const { SuccessToast, ErrorToast } = useToastMessage();

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

  // 프로필 수정
  const {
    mutate: updateUserProfile,
    isPending: updateUserProfileLoading,
    isError: updateUserProfileError,
  } = useUserControllerUpdateUserProfile();

  const handleChangeProfileForm = (
    key: keyof typeof userInfo,
    value: string
  ) => {
    setUserInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 인증코드 전송
  const handleSendVerificationCode = () => {
    SuccessToast("인증코드가 전송되었습니다.");

    sendVerificationCode(
      {
        data: {
          phoneNumber: userInfo.phoneNumber,
        },
      },
      {
        onSuccess: () => {
          setIsSended(true);
          setIsActive(true);
          setSeconds(180);

          return SuccessToast("휴대폰 인증이 완료되었습니다.");
        },
      }
    );
  };

  // 휴대폰 인증번호 검증
  const handleVerifyPhoneNumber = () => {
    verifyPhoneNumber(
      {
        data: {
          phoneNumber: userInfo.phoneNumber,
          verificationCode,
        },
      },
      {
        onSuccess: () => {
          setIsSended(true);
          setIsActive(true);
          setSeconds(180);

          return SuccessToast("휴대폰 인증이 완료되었습니다.");
        },
      }
    );
  };

  // 프로필 수정
  const handleUpdateProfile = () => {
    if (
      userInfo.name === route.name &&
      userInfo.phoneNumber === route.params.phoneNumber
    ) {
      return ErrorToast("변경된 내용이 없습니다.");
    }

    updateUserProfile(
      {
        data: {
          name: userInfo.name,
          phoneNumber: userInfo.phoneNumber,
        },
      },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          SuccessToast("프로필이 수정되었습니다.");

          return containerNavigation.goBack();
        },
        onError: (error: any) => {
          setErrorModal({
            visible: true,
            message: error?.message ?? "프로필 수정 중 에러가 발생했습니다.",
          });
        },
      }
    );
  };

  // 휴대폰번호 입력 시 자동으로 검증 요청
  useEffect(() => {
    if (
      userInfo.phoneNumber.length !== 13 ||
      userInfo.phoneNumber === route.params.phoneNumber
    ) {
      setIsPhoneNumberValid(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      checkPhoneNumber({
        data: {
          phoneNumber: userInfo.phoneNumber,
        },
      });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [userInfo.phoneNumber]);

  // 휴대폰 번호 입력 완료해야 인증코드 발송 가능
  useEffect(() => {
    if (userInfo.phoneNumber.length !== 13) {
      return;
    } else if (
      checkPhoneNumberData &&
      phoneNumberSchema.safeParse(userInfo).success
    ) {
      setIsPhoneNumberValid(true);
    } else {
      setIsPhoneNumberValid(false);
    }
  }, [checkPhoneNumberData, phoneNumberSchema]);

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

  useEffect(() => {
    const isNameChanged = userInfo.name !== route.params.name;
    const isPhoneNumberChanged =
      userInfo.phoneNumber !== route.params.phoneNumber;

    const isNameValid = nameSchema.safeParse({ name: userInfo.name }).success;
    const isPhoneValid = phoneNumberSchema.safeParse({
      phoneNumber: userInfo.phoneNumber,
    }).success;

    if (isNameChanged && !isPhoneNumberChanged) {
      setIsValid(isNameValid);
    } else if (!isNameChanged && isPhoneNumberChanged) {
      setIsValid(isPhoneValid && isPhoneNumberValid);
    } else if (isNameChanged && isPhoneNumberChanged) {
      setIsValid(isNameValid && isPhoneValid && isPhoneNumberValid);
    } else {
      setIsValid(false);
    }
  }, [userInfo]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          style={styles.container}
        >
          <CustomText fontSize={16} marginTop={20}>
            이름
          </CustomText>
          <CustomTextInput
            value={userInfo.name}
            onChangeText={(text) => handleChangeProfileForm("name", text)}
            placeholder="이름을 입력해주세요."
            maxLength={10}
          />

          <CustomText fontSize={16} marginTop={32}>
            휴대폰 번호
          </CustomText>
          <View style={styles.inputBox}>
            <CustomTextInput
              value={userInfo.phoneNumber}
              onChangeText={(value) =>
                handleChangeProfileForm("phoneNumber", formatPhoneNumber(value))
              }
              errorMessage={
                userInfo.phoneNumber.length === 13
                  ? (checkPhoneNumberError as CustomError)?.message ?? undefined
                  : undefined
              }
              maxLength={13}
              keyboardType="number-pad"
              placeholder="휴대폰 번호를 입력해주세요."
              flex={1}
            />
            <Pressable
              onPress={handleSendVerificationCode}
              disabled={!isPhoneNumberValid}
              style={[
                styles.sendCodeButton,
                {
                  borderColor: isPhoneNumberValid ? colors.main : colors.gray5,
                },
              ]}
            >
              <CustomText
                color={isPhoneNumberValid ? colors.main : colors.gray5}
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
                <CustomTextInput
                  value={verificationCode}
                  onChangeText={(text) => setVerificationCode(text)}
                  flex={1}
                  maxLength={6}
                  keyboardType="number-pad"
                  errorMessage={
                    !seconds
                      ? "인증시간이 만료되었습니다."
                      : (verifyPhoneNumberError as CustomError)?.message ??
                        undefined
                  }
                  onFocus={() => {
                    scrollRef.current?.scrollTo({ y: 1000, animated: true });
                  }}
                  placeholder="인증번호 6자리"
                />

                <View style={styles.timer}>
                  <CustomText>{formatTime(seconds)}</CustomText>
                </View>
              </View>
            </>
          )}

          <CustomText fontSize={16} marginTop={32}>
            이메일
          </CustomText>
          <CustomTextInput value={route.params.email ?? ""} editable={false} />
          <CustomText marginTop={4} color={colors.gray5} fontSize={13}>
            {formatLoginKind(route.params.loginKind)} 계정으로 가입한
            계정이에요.
          </CustomText>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: getResponsiveSize(20),
            paddingVertical: getResponsiveSize(10),
          }}
        >
          <CustomButton
            onPress={handleUpdateProfile}
            isDisabled={!isValid}
            height={getResponsiveSize(53)}
            backgroundColor={isValid ? colors.main : colors.gray2}
          >
            {updateUserProfileLoading ? (
              <Spinner />
            ) : (
              <CustomText
                color={isValid ? colors.white : colors.gray5}
                fontSize={16}
                fontWeight={"600"}
              >
                저장하기
              </CustomText>
            )}
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
    paddingBottom: getResponsiveSize(200),
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
