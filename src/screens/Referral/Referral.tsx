import { useState } from "react";
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

export const Referral = () => {
  const [referralCode, setReferralCode] = useState<string>("");

  const setErrorModal = useSetAtom(errorModalAtom);

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
      return ErrorToast("추천코드는 6자 입니다.");
    }

    if (referralCodeData?.data.referralCode === referralCode) {
      return ErrorToast("본인의 추천코드는 등록할 수 없습니다.");
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
            return ErrorToast("잘못된 추천코드입니다.");
          }

          SuccessToast("추천코드가 등록되었습니다.");

          return referralRefetch();
        },
        onError: (error: any) => {
          setErrorModal({
            visible: true,
            message: error?.message ?? "추천코드 등록 중 오류가 발생했습니다.",
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
      () => SuccessToast("추천코드가 복사되었습니다.")
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
                현재 초대한 친구
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
                  명
                </CustomText>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <View style={styles.referralCode}>
              <CustomText fontSize={16} fontWeight={"600"}>
                나의 추천 코드
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
                  카톡으로 초대하기
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
                  추천 코드 복사하기
                </CustomText>
              </CustomButton>
            </View>

            <CustomText marginTop={40} fontSize={18} fontWeight={"600"}>
              추천 코드 등록
            </CustomText>
            <CustomText color={colors.gray5} fontSize={14}>
              추천 코드는 입력 후 변경할 수 없어요.
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
                placeholder="추천코드 입력"
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
                  코드등록
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
                    코드등록
                  </CustomText>
                )}
              </CustomButton>
            )}
          </View>

          <View style={styles.terms}>
            <CustomText color={colors.gray7} fontSize={14}>
              유의사항
            </CustomText>
            <CustomText color={colors.gray7} fontSize={14}>
              • 당첨자 발표 : 2026.01.06 (화)
            </CustomText>
            <CustomText color={colors.gray7} fontSize={14}>
              • 경품 지급일 : 당첨자 발표 이후 영업일 30일 이내에 리워드가
              지급됩니다.
            </CustomText>
            <CustomText color={colors.gray7} fontSize={14}>
              • 초대받은 친구 중 회원가입을 완료한 친구 수 만큼 친구 초대 이벤트
              경품이 지급됩니다.
            </CustomText>
            <CustomText color={colors.gray7} fontSize={14}>
              • 이벤트 기간부터 최종 경품 지급 시기까지 초대한 사람, 초대받은
              사람 모두 계정을 유지해야 경품이 지급됩니다.
            </CustomText>
            <CustomText color={colors.gray7} fontSize={14}>
              • 지급되는 경품의 금액이 5만원을 초과할 경우, 경품에 제세공과금이
              부과되며, 이는 당사가 부담합니다.
            </CustomText>
            <CustomText color={colors.gray7} fontSize={14}>
              • 추천 코드는 가입 후 1회만 등록할 수 있으며, 이후 수정은
              불가합니다.
            </CustomText>
            <CustomText color={colors.gray7} fontSize={14}>
              • 본인의 추천 코드를 자신에게 등록할 수 없습니다.
            </CustomText>
            <CustomText color={colors.gray7} fontSize={14}>
              • 부정한 방법(가짜 계정, 반복 등록 등)으로 참여한 경우 혜택은
              회수되며, 서비스 이용이 제한될 수 있습니다.
            </CustomText>
            <CustomText color={colors.gray7} fontSize={14}>
              • 상품 지급 대상자는 선착순 100명으로 한정됩니다.
            </CustomText>
            <CustomText color={colors.gray7} fontSize={14}>
              • 본 이벤트는 당사의 사정에 따라 변경 또는 종료될 수 있습니다.
            </CustomText>
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
