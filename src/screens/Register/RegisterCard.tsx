import { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { z } from "zod";
import isEmpty from "lodash/isEmpty";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import { useUserControllerRegisterExtraInfo } from "@/api/user/user";
import { LoginStackParamList } from "@/navigations";
import {
  formatCardExpiration,
  formatCardNumber,
  getResponsiveSize,
} from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { SignUpTextInput } from "@/components/ui/TextInput";
import { Spinner } from "@/components/ui/Spinner";
import { colors } from "@/styles";

type RegisterCardRouteProp = RouteProp<LoginStackParamList, "RegisterCard">;

export const RegisterCard = () => {
  const route = useRoute<RegisterCardRouteProp>();

  const { t } = useTranslation("auth");

  // 유효성 검사
  const registerFormSchema = useMemo(
    () =>
      z.object({
        cardNumber: z
          .string()
          .trim()
          .length(19, t("validation.cardNumberInvalid")),
        expiration: z
          .string()
          .trim()
          .length(7, t("validation.expirationInvalid")),
        cardPassword: z
          .string()
          .trim()
          .length(2, t("validation.cardPasswordInvalid")),
        identityNumber: z
          .string()
          .trim()
          .refine(
            (val) => val.length === 6 || val.length === 10,
            t("validation.birthDateInvalid")
          ),
      }),
    [t]
  );

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

  // 추가정보 등록 API
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
            message:
              error?.message ?? t("register.card.error.registerFailed"),
          });
        },
      }
    );
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CustomText fontSize={24} fontWeight={"600"}>
              {t("register.card.title")}
            </CustomText>

            <CustomText marginTop={32} fontSize={16} fontWeight={"500"}>
              {t("register.card.cardNumber")}
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
              {t("register.card.expiration")}
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
              {t("register.card.password")}
            </CustomText>
            <SignUpTextInput
              value={registerForm.cardPassword}
              onChangeText={(value) =>
                handleRegisterForm("cardPassword", value)
              }
              maxLength={2}
              keyboardType="number-pad"
              secureTextEntry={true}
              placeholder={t("register.card.passwordPlaceholder")}
            />

            <CustomText marginTop={32} fontSize={16} fontWeight={"500"}>
              {t("register.card.birthDate")}
            </CustomText>
            <SignUpTextInput
              value={registerForm.identityNumber}
              onChangeText={(value) =>
                handleRegisterForm("identityNumber", value)
              }
              maxLength={10}
              keyboardType="number-pad"
              placeholder={t("register.card.birthDatePlaceholder")}
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
                {t("common:next")}
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
          {t("skip")}
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
    paddingVertical: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(20),
  },
  selectInput: {
    flex: 1,
  },
  list: {
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
});
