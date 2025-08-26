import { useState } from "react";
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
  regexCarNumber,
} from "@/utils";
import { colors } from "@/styles";
import { useUserControllerRegisterExtraInfo } from "@/api/user/user";

type RegisterCardRouteProp = RouteProp<LoginStackParamList, "RegisterCar">;

// 유효성 검사
const registerFormSchema = z.object({
  cardNumber: z.string().trim().length(22, "올바른 카드 번호를 입력해주세요."),
  expiration: z.string().trim().length(7, "올바른 유효 기간을 입력해주세요."),
  cardPassword: z
    .string()
    .trim()
    .length(22, "올바른 카드 비밀번호를 입력해주세요."),
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
                expirationYear: registerForm.expiration.slice(2, 4),
                expirationMonth: registerForm.expiration.slice(0, 2),
                identityNumber: registerForm.expiration,
              }
            : {}),
        },
      },
      {
        onSuccess: () => {
          return loginStackNavigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "RegisterComplete" }],
            })
          );
        },
      }
    );
  };

  const handleSkipRegist = () => {
    loginStackNavigation.navigate("RegisterCard", {});
  };

  const handleNextStep = () => {};

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

            <CustomText fontSize={16} marginTop={32}>
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

            <CustomText fontSize={16} marginTop={32}>
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

            <CustomText fontSize={16} marginTop={32}>
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

            <CustomText fontSize={16} marginTop={32}>
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

          <Pressable onPress={handleComplete}>
            <CustomText
              color={colors.gray7}
              fontSize={16}
              fontWeight={"600"}
              textAlign="center"
              marginBottom={20}
            >
              다음에 등록할게요
            </CustomText>
          </Pressable>

          <CustomButton
            onPress={handleComplete}
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
