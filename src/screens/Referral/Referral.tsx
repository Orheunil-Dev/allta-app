import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { shareCustomTemplate } from "@react-native-kakao/share";
import * as Clipboard from "expo-clipboard";
import { useSetAtom } from "jotai";
import {
  useReferralControllerGetUserReferralCode,
  useReferralControllerRegisterReferralCode,
} from "@/api/referral/referral";
import { errorModalAtom } from "@/jotai";
import { useToastMessage } from "@/hooks";
import { getFontSize, getResponsiveSize } from "@/utils";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomImage } from "@/components/ui/CustomImage";
import { Spinner } from "@/components/ui/Spinner";
import { referralBanner } from "@/assets/images";
import { colors, fontMap } from "@/styles";

const { width: screenWidth } = Dimensions.get("window");

const REFERRAL_NOTICE_KEYS = [
  "announcement",
  "rewardDate",
  "rewardPerFriend",
  "keepAccount",
  "tax",
  "oneTimeOnly",
  "noSelfCode",
  "fraud",
  "limitedQuantity",
  "notification",
  "subjectToChange",
] as const;

export const Referral = () => {
  const [referralCode, setReferralCode] = useState<string>("");

  const setErrorModal = useSetAtom(errorModalAtom);

  const { t } = useTranslation("benefit");

  const { SuccessToast, ErrorToast } = useToastMessage();

  // 추천코드 조회 API
  const {
    data: referralCodeData,
    isPending: referralCodeLoading,
    isError: referralCodeError,
    refetch: referralRefetch,
  } = useReferralControllerGetUserReferralCode();

  // 추천코드 입력 API
  const {
    mutate: registerReferralCode,
    isPending: registerReferralCodeLoading,
    isError: registerReferralCodeError,
  } = useReferralControllerRegisterReferralCode();

  // 추첱코드 등록
  const handleRegisterReferralCode = () => {
    if (referralCode.length !== 6) {
      return ErrorToast(t("referral.codeLength"));
    }

    if (referralCodeData?.data.referralCode === referralCode) {
      return ErrorToast(t("referral.ownCode"));
    }

    registerReferralCode(
      {
        data: {
          referralCode,
        },
      },
      {
        onSuccess: (res) => {
          if (!res.ok) {
            return ErrorToast(t("referral.invalidCode"));
          }

          SuccessToast(t("referral.registered"));

          return referralRefetch();
        },
        onError: (error: any) => {
          setErrorModal({
            visible: true,
            message: error?.message ?? t("referral.registerError"),
          });
        },
      }
    );
  };

  // 카카오톡 공유하기
  const handleKakaoShare = async () => {
    if (!referralCodeData?.data) return;

    await shareCustomTemplate({
      templateId: 125068,
      templateArgs: {
        userName: referralCodeData.data.name,
        referralCode: referralCodeData.data.referralCode,
      },
    });
  };

  // 추천코드 클립보드에 복사
  const handleCopyToClipboard = async () => {
    if (!referralCodeData?.data.referralCode.length) return;

    await Clipboard.setStringAsync(referralCodeData?.data.referralCode).then(
      () => SuccessToast(t("referral.copied"))
    );
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        <ScrollView>
          <CustomImage source={referralBanner} width={screenWidth} />

          <View style={styles.eventBannerBottom}>
            <View style={styles.referredCount}>
              <CustomText color={colors.white} fontSize={16}>
                {t("referral.invitedFriends")}
              </CustomText>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <CustomText
                  marginRight={6}
                  color="#FFC935"
                  fontSize={24}
                  fontWeight={"600"}
                >
                  {referralCodeData?.data.referredCount ?? 0}
                </CustomText>
                <CustomText color={colors.white} fontSize={16}>
                  {t("referral.countUnit")}
                </CustomText>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.referralCode}>
              <CustomText fontSize={16} fontWeight={"600"}>
                {t("referral.myCode")}
              </CustomText>
              <CustomText fontSize={24} fontWeight={"600"} letterSpacing={0.1}>
                {referralCodeData?.data.referralCode ?? ""}
              </CustomText>
            </View>

            <View style={styles.buttonArea}>
              <CustomButton
                onPress={handleKakaoShare}
                flex={1}
                height={getResponsiveSize(50)}
                backgroundColor={colors.point2}
              >
                <CustomText
                  color={colors.white}
                  fontSize={16}
                  fontWeight={"600"}
                >
                  {t("referral.shareKakao")}
                </CustomText>
              </CustomButton>

              <CustomButton
                onPress={handleCopyToClipboard}
                flex={1}
                height={getResponsiveSize(50)}
                backgroundColor={colors.point2}
              >
                <CustomText
                  color={colors.white}
                  fontSize={16}
                  fontWeight={"600"}
                >
                  {t("referral.copyCode")}
                </CustomText>
              </CustomButton>
            </View>

            <CustomText marginTop={40} fontSize={18} fontWeight={"600"}>
              {t("referral.registerTitle")}
            </CustomText>
            <CustomText color={colors.gray5} fontSize={14}>
              {t("referral.registerDescription")}
            </CustomText>
          </View>

          <View style={styles.codeArea}>
            {referralCodeData?.data.referrerCode ? (
              <View style={styles.referrerCode}>
                <CustomText
                  color={colors.gray5}
                  fontSize={15}
                  fontWeight={"500"}
                >
                  {referralCodeData?.data.referrerCode}
                </CustomText>
              </View>
            ) : (
              <TextInput
                defaultValue={referralCode}
                onChangeText={(text) => {
                  setReferralCode(text);
                }}
                keyboardType="default"
                autoCorrect={false}
                autoCapitalize="none"
                placeholder={t("referral.codePlaceholder")}
                maxLength={6}
                underlineColorAndroid="transparent"
                style={styles.codeInput}
              />
            )}

            {referralCodeData?.data.referrerCode ? (
              <View style={styles.referrerCodeButton}>
                <CustomText
                  color={colors.gray5}
                  fontSize={15}
                  fontWeight={"500"}
                >
                  {t("referral.registerCode")}
                </CustomText>
              </View>
            ) : (
              <CustomButton
                onPress={handleRegisterReferralCode}
                isDisabled={
                  !!referralCodeData?.data.referrerCode ||
                  registerReferralCodeLoading
                }
                width={getResponsiveSize(74)}
                height={getResponsiveSize(45)}
                borderWidth={1}
                borderColor={colors.gray2}
              >
                {registerReferralCodeLoading ? (
                  <Spinner />
                ) : (
                  <CustomText fontSize={15} fontWeight={"500"}>
                    {t("referral.registerCode")}
                  </CustomText>
                )}
              </CustomButton>
            )}
          </View>

          <View style={styles.terms}>
            <CustomText color={colors.gray7} fontSize={14}>
              {t("referral.notice.title")}
            </CustomText>
            {REFERRAL_NOTICE_KEYS.map((key) => (
              <CustomText key={key} color={colors.gray7} fontSize={14}>
                • {t(`referral.notice.${key}`)}
              </CustomText>
            ))}
          </View>
        </ScrollView>
      </CustomKeyboardAvoidingView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getResponsiveSize(20),
  },
  eventBannerBottom: {
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(20),
    backgroundColor: "#1A1A36",
  },
  referredCount: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: getResponsiveSize(10),
    paddingHorizontal: getResponsiveSize(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  referralCode: {
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 12,
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(40),
    gap: getResponsiveSize(16),
    borderBottomWidth: 6,
    borderBottomColor: colors.gray1,
  },
  codeArea: {
    flexDirection: "row",
    marginBottom: getResponsiveSize(40),
    paddingHorizontal: getResponsiveSize(20),
    gap: getResponsiveSize(12),
  },
  codeInput: {
    flex: 1,
    fontFamily: fontMap["500"],
    fontSize: getFontSize(15),
    fontWeight: "500",
    paddingHorizontal: getResponsiveSize(12),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
  },
  referrerCode: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: getResponsiveSize(12),
    backgroundColor: colors.gray1,
    borderRadius: 8,
  },
  referrerCodeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: getResponsiveSize(74),
    height: getResponsiveSize(45),
    backgroundColor: colors.gray1,
  },
  terms: {
    marginBottom: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(16),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.gray1,
  },
});
