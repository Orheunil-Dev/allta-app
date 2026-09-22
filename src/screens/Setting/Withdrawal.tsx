import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CookieManager from "@react-native-cookies/cookies";
import * as SecureStore from "expo-secure-store";
import { useSetAtom } from "jotai";
import { Airbridge } from "airbridge-react-native-sdk";
import { useUserControllerWithdrawalUser } from "@/api/user/user";
import { commonModalAtom, errorModalAtom } from "@/jotai";
import { getResponsiveSize } from "@/utils";
import { ContainerStackParamList } from "@/navigations";
import { CustomModal } from "@/components/ui/CustomModal";
import { CustomText } from "@/components/ui/CustomText";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomButton } from "@/components/ui/CustomButton";
import { BottomButtonArea } from "@/components/layout/BottomButtonArea";
import { checkedRadioIcon, uncheckedRadioIcon } from "@/assets/images";
import { colors } from "@/styles";

// value는 API(deleteReason)로 전송되는 값이라 번역하지 않고, 화면 표시는 labelKey로 처리
const withdrawalReasons = [
  { value: "앱 사용이 불편했어요.", labelKey: "withdrawal.reasons.inconvenient" },
  { value: "자주 사용하지 않아요.", labelKey: "withdrawal.reasons.rarelyUsed" },
  { value: "가격이 부담돼요.", labelKey: "withdrawal.reasons.expensive" },
  {
    value: "이용하는 매장 상태가 만족스럽지 않아요.",
    labelKey: "withdrawal.reasons.storeUnsatisfied",
  },
] as const;

export const Withdrawal = () => {
  const { t } = useTranslation("mypage");

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const setCommonModal = useSetAtom(commonModalAtom);
  const setErrorModal = useSetAtom(errorModalAtom);

  const [reason, setReason] = useState<string>("");
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    mutate: withdrawal,
    isError: withdrawalError,
    isPending: withdrawalLoading,
  } = useUserControllerWithdrawalUser();

  const handleWithdrawal = () => {
    withdrawal(
      {
        data: {
          deleteReason: reason,
        },
      },
      {
        onSuccess: async () => {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");

          await CookieManager.clearAll();

          // 회원 탈퇴 이벤트 트래킹
          Airbridge.trackEvent("Withdrawal");
          Airbridge.clearUser();

          setCommonModal({
            visible: true,
            title: t("withdrawal.completeModal.title"),
            message: t("withdrawal.completeModal.message"),
          });

          return containerNavigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "LoginStack",
                  state: {
                    routes: [{ name: "Login" }],
                  },
                },
              ],
            })
          );
        },
        onError: (error: any) => {
          setErrorModal({
            visible: true,
            message: error?.message ?? t("withdrawal.error"),
          });
        },
      }
    );
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomModal
        visible={showModal}
        onClose={handleWithdrawal}
        isCloseButtonDisable={withdrawalLoading}
        closeButtonText={t("withdrawal.confirmModal.withdraw")}
        onNext={() => setShowModal(false)}
        nextButtonText={t("withdrawal.confirmModal.goBack")}
      >
        <CustomText fontSize={18} fontWeight={"600"}>
          {t("withdrawal.confirmModal.title")}
        </CustomText>

        <CustomText marginTop={8} fontSize={16} textAlign="center">
          {t("withdrawal.confirmModal.description")}
        </CustomText>
        <CustomText marginTop={20} fontSize={16}>
          {t("withdrawal.confirmModal.question")}
        </CustomText>
      </CustomModal>

      <View style={styles.container}>
        <CustomText fontSize={24} fontWeight={"700"}>
          {t("withdrawal.title")}
        </CustomText>

        <View style={{ marginTop: getResponsiveSize(20) }}>
          {withdrawalReasons.map(({ value, labelKey }) => (
            <View key={value} style={styles.reason}>
              <Pressable
                onPress={() => {
                  {
                    reason === value ? setReason("") : setReason(value);
                  }
                  setShowTextInput(false);
                }}
              >
                <Image
                  source={
                    reason === value ? checkedRadioIcon : uncheckedRadioIcon
                  }
                  style={styles.button}
                />
              </Pressable>

              <CustomText fontSize={16}>{t(labelKey)}</CustomText>
            </View>
          ))}

          <View style={styles.reason}>
            <Pressable
              onPress={() => {
                setReason("");
                setShowTextInput(!showTextInput);
              }}
            >
              <Image
                source={showTextInput ? checkedRadioIcon : uncheckedRadioIcon}
                style={styles.button}
              />
            </Pressable>

            <CustomText fontSize={16}>{t("withdrawal.otherReason")}</CustomText>
          </View>
        </View>

        {showTextInput && (
          <CustomTextInput
            value={reason}
            onChangeText={setReason}
            maxLength={50}
            justifyContent="flex-start"
            onReset={() => setReason("")}
          />
        )}
      </View>

      <BottomButtonArea>
        <CustomButton
          isDisabled={!reason.trim()}
          onPress={() => setShowModal(true)}
          width={"100%"}
          height={getResponsiveSize(53)}
          backgroundColor={reason.trim() ? colors.point2 : colors.gray2}
        >
          <CustomText
            color={reason.trim() ? colors.white : colors.gray5}
            fontSize={18}
            fontWeight={"600"}
          >
            {t("withdrawal.submit")}
          </CustomText>
        </CustomButton>
      </BottomButtonArea>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
  },
  reason: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
  button: {
    width: getResponsiveSize(16),
    height: getResponsiveSize(16),
    marginRight: getResponsiveSize(10),
  },
});
