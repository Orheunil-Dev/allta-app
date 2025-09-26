import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@/navigations";
import { z } from "zod";
import isEmpty from "lodash/isEmpty";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { SignUpTextInput } from "@/components/ui/TextInput";
import {
  formatCardExpiration,
  formatCardNumber,
  getResponsiveSize,
} from "@/utils";
import { colors } from "@/styles";
import { useUserControllerRegisterExtraInfo } from "@/api/user/user";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/recoil";
import { Spinner } from "@/components/ui/Spinner";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RegisterCardRouteProp = RouteProp<LoginStackParamList, "RegisterCard">;

// 유효성 검사
const registerFormSchema = z.object({
  cardNumber: z.string().trim().length(19, "올바른 카드 번호를 입력해주세요."),
  expiration: z.string().trim().length(7, "올바른 유효 기간을 입력해주세요."),
  cardPassword: z
    .string()
    .trim()
    .length(2, "올바른 카드 비밀번호를 입력해주세요."),
  identityNumber: z
    .string()
    .trim()
    .refine(
      (val) => val.length === 6 || val.length === 10,
      "올바른 생년월일을 입력해주세요."
    ),
});

export const RegisterCard = () => {
  const route = useRoute<RegisterCardRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const setErrorModal = useSetAtom(errorModalAtom);

  const insets = useSafeAreaInsets();

  const [registerForm, setRegisterForm] = useState({
    cardNumber: "",
    expiration: "",
    cardPassword: "",
    identityNumber: "",
  });

  // 추가정보 등록
  const {
    mutate: registerInfo,
    isPending: registerInfoLoading,
    isError: registerInfoError,
  } = useUserControllerRegisterExtraInfo();

  const handleRegisterForm = (
    key: keyof typeof registerForm,
    value: string
  ) => {
    setRegisterForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isValid = registerFormSchema.safeParse(registerForm).success;

  const handleComplete = () => {
    if (!isValid && isEmpty(route.params)) {
      return loginStackNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "RegisterComplete",
              params: {
                isRegister: false,
              },
            },
          ],
        })
      );
    }

    registerInfo(
      {
        data: {
          ...(route.params ?? {}),
          ...(isValid
            ? {
                cardNumber: registerForm.cardNumber.replace(/-/g, ""),
                cardPassword: registerForm.cardPassword,
                expirationYear: registerForm.expiration
                  .replace(/\s/g, "")
                  .slice(3, 5),
                expirationMonth: registerForm.expiration
                  .replace(/\s/g, "")
                  .slice(0, 2),
                identityNumber: registerForm.identityNumber,
              }
            : {}),
        },
      },
      {
        onSuccess: () => {
          return loginStackNavigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "RegisterComplete",
                  params: {
                    isRegister: true,
                  },
                },
              ],
            })
          );
        },
        onError: (error: any) => {
          setErrorModal({
            visible: true,
            message: error?.message ?? "추가정보 등록에 실패했습니다.",
          });
        },
      }
    );
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <CustomText fontSize={24} fontWeight={"600"}>
              결제할 카드를 등록해주세요.
            </CustomText>

            <CustomText marginTop={32} fontSize={16} fontWeight={"500"}>
              카드번호
            </CustomText>
            <SignUpTextInput
              value={registerForm.cardNumber}
              onChangeText={(value) =>
                handleRegisterForm("cardNumber", formatCardNumber(value))
              }
              maxLength={19}
              keyboardType="number-pad"
              placeholder="0000-0000-0000-0000"
            />

            <CustomText marginTop={32} fontSize={16} fontWeight={"500"}>
              유효기간
            </CustomText>
            <SignUpTextInput
              value={registerForm.expiration}
              onChangeText={(value) =>
                handleRegisterForm("expiration", formatCardExpiration(value))
              }
              maxLength={7}
              keyboardType="number-pad"
              placeholder="MM / YY"
            />

            <CustomText marginTop={32} fontSize={16} fontWeight={"500"}>
              비밀번호
            </CustomText>
            <SignUpTextInput
              value={registerForm.cardPassword}
              onChangeText={(value) =>
                handleRegisterForm("cardPassword", value)
              }
              maxLength={2}
              keyboardType="number-pad"
              secureTextEntry={true}
              placeholder="앞 두자리"
            />

            <CustomText marginTop={32} fontSize={16} fontWeight={"500"}>
              생년월일
            </CustomText>
            <SignUpTextInput
              value={registerForm.identityNumber}
              onChangeText={(value) =>
                handleRegisterForm("identityNumber", value)
              }
              maxLength={10}
              keyboardType="number-pad"
              placeholder="생년월일 또는 사업자등록번호"
            />
          </ScrollView>

          <CustomButton
            onPress={handleComplete}
            isDisabled={!isValid || registerInfoLoading}
            height={getResponsiveSize(53)}
            backgroundColor={isValid ? colors.main : colors.gray2}
          >
            {registerInfoLoading ? (
              <Spinner />
            ) : (
              <CustomText
                color={isValid ? colors.white : colors.gray5}
                fontSize={16}
                fontWeight={"600"}
              >
                다음
              </CustomText>
            )}
          </CustomButton>
        </View>
      </CustomKeyboardAvoidingView>

      <Pressable
        onPress={handleComplete}
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
  selectInput: {
    flex: 1,
  },
  list: {
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
});
