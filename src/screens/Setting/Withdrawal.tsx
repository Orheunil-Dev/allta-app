import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomButton } from "@/components/ui/CustomButton";
import { BottomButtonArea } from "@/components/layout/BottomButtonArea";
import { checkedRadioIcon, uncheckedRadioIcon } from "@/assets/images";
import { colors } from "@/styles";
import { useUserControllerWithdrawalUser } from "@/api/user/user";
import * as SecureStore from "expo-secure-store";
import CookieManager from "@react-native-cookies/cookies";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import { useSetAtom } from "jotai";
import { commonModalAtom, errorModalAtom } from "@/recoil";
import { CustomModal } from "@/components/ui/CustomModal";

const withdrawalReasons = [
  "앱 사용이 불편했어요.",
  "자주 사용하지 않아요.",
  "가격이 부담돼요.",
  "이용하는 매장 상태가 만족스럽지 않아요.",
];

export const Withdrawal = () => {
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

          setCommonModal({
            visible: true,
            title: "회원 탈퇴 완료",
            message: "회원 탈퇴가 완료되었습니다.\n감사합니다.",
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
            message: error?.message ?? "회원 탈퇴에 실패했습니다.",
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
        closeButtonText="탈퇴하기"
        onNext={() => setShowModal(false)}
        nextButtonText="돌아가기"
      >
        <CustomText fontSize={18} fontWeight={"600"}>
          정말 회원 탈퇴를 하시나요?
        </CustomText>

        <CustomText marginTop={8} fontSize={16}>
          탈퇴 시 계정 및 보유 이용권과 쿠폰은
        </CustomText>
        <CustomText fontSize={16}>삭제되어 복구 할 수 없습니다.</CustomText>
        <CustomText marginTop={20} fontSize={16}>
          정말 탈퇴하시겠습니까?
        </CustomText>
      </CustomModal>

      <View style={styles.container}>
        <CustomText fontSize={24} fontWeight={"700"}>
          더 나은 서비스를 위해
        </CustomText>
        <CustomText fontSize={24} fontWeight={"700"}>
          탈퇴 사유를 알려주세요.
        </CustomText>

        <View style={{ marginTop: getResponsiveSize(20) }}>
          {withdrawalReasons.map((value, index) => (
            <View key={index} style={styles.reason}>
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

              <CustomText fontSize={16}>{value}</CustomText>
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

            <CustomText fontSize={16}>기타 (직접입력)</CustomText>
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
            탈퇴하기
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
