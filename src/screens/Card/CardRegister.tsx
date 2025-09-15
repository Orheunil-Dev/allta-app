import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CardStackParamList } from "@/navigations";
import { z } from "zod";
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
import { useCardControllerRegisterCard } from "@/api/card/card";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/recoil";

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

export const CardRegister = () => {
  const cardStackNavigation =
    useNavigation<NativeStackNavigationProp<CardStackParamList>>();

  const queryClient = useQueryClient();

  const setErrorModal = useSetAtom(errorModalAtom);

  const [registerForm, setRegisterForm] = useState({
    cardNumber: "",
    expiration: "",
    cardPassword: "",
    identityNumber: "",
  });

  // 카드 등록
  const {
    mutate: registerCard,
    isError: registerCardError,
    isPending: regiserCardLoading,
  } = useCardControllerRegisterCard({});

  const handleChangeRegisterForm = (
    key: keyof typeof registerForm,
    value: string
  ) => {
    setRegisterForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    registerCard(
      {
        data: {
          cardNumber: registerForm.cardNumber.replace(/-/g, ""),
          cardPassword: registerForm.cardPassword,
          expirationYear: registerForm.expiration
            .replace(/\s/g, "")
            .slice(3, 5),
          expirationMonth: registerForm.expiration
            .replace(/\s/g, "")
            .slice(0, 2),
          identityNumber: registerForm.identityNumber,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cards"] });

          return cardStackNavigation.goBack();
        },
        onError: (error: any) => {
          setErrorModal({
            visible: true,
            message: error?.message ?? "알 수 없는 오류가 발생했습니다.",
          });
        },
      }
    );
  };

  const isValid = registerFormSchema.safeParse(registerForm).success;

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <CustomText fontSize={16} fontWeight={"500"}>
              카드번호
            </CustomText>
            <SignUpTextInput
              value={registerForm.cardNumber}
              onChangeText={(value) =>
                handleChangeRegisterForm("cardNumber", formatCardNumber(value))
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
                handleChangeRegisterForm(
                  "expiration",
                  formatCardExpiration(value)
                )
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
                handleChangeRegisterForm("cardPassword", value)
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
                handleChangeRegisterForm("identityNumber", value)
              }
              maxLength={10}
              keyboardType="number-pad"
              placeholder="생년월일 또는 사업자등록번호"
            />
          </ScrollView>

          <CustomButton
            onPress={handleSubmit}
            isDisabled={!isValid}
            height={getResponsiveSize(53)}
            backgroundColor={isValid ? colors.main : colors.gray2}
          >
            <CustomText
              color={isValid ? colors.white : colors.gray5}
              fontSize={16}
              fontWeight={"600"}
            >
              등록하기
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
