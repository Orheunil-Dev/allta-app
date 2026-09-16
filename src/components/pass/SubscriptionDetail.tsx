import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RouteProp } from "@react-navigation/native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { errorModalAtom } from "@/jotai";
import dayjs from "dayjs";
import {
  usePassControllerDiscontinueSubscription,
  usePassControllerResubscribeSubscription,
} from "@/api/pass/pass";
import { GetSubscriptionDetailResponse } from "@/api/models";
import { PassStackParamList } from "@/navigations";
import { useDistanceCalculator, useToastMessage } from "@/hooks";
import {
  formatCardCompany,
  formatEllipsis,
  formatPassType,
  formatServiceType,
  formatUsageLeft,
  getAvailablePeriod,
  getResponsiveSize,
} from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomModal } from "@/components/ui/CustomModal";
import { CardChangeButton } from "./CardChangeButton";
import { defaultStoreImage, locationIcon, termsArrow } from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  data: GetSubscriptionDetailResponse["data"];
  subscriptionRefetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<GetSubscriptionDetailResponse, unknown>>;
  router: RouteProp<PassStackParamList, "PassDetail">;
  coordinate: {
    lat: number;
    lng: number;
  };
  handleRouteMyStoreDetail: () => void;
}

export const SubscriptionDetail = ({
  router,
  coordinate,
  data,
  subscriptionRefetch,
  handleRouteMyStoreDetail,
}: Props) => {
  const { t } = useTranslation("pass");

  const setErrorModal = useSetAtom(errorModalAtom);

  const [passTermsOpen, setPassTermsOpen] = useState<boolean>(false);
  const [refundTermsOpen, setRefundTermsOpen] = useState<boolean>(false);
  const [showDiscontinueModal, setShowDicontinueModal] =
    useState<boolean>(false);
  const [showResubscribeModal, setShowResubscribeModal] =
    useState<boolean>(false);

  // 구독권 갱신 해지 API
  const {
    mutate: discontinueSubscription,
    isPending: discontinueSubscriptionLoading,
    isError: discontinueSubscriptionError,
  } = usePassControllerDiscontinueSubscription();

  // 구독권 재구독 API
  const {
    mutate: resubscribeSubscription,
    isPending: resubscribeSubscriptionLoading,
    isError: resubscribeSubscriptionError,
  } = usePassControllerResubscribeSubscription();

  const { getDistance } = useDistanceCalculator();
  const { SuccessToast } = useToastMessage();

  // 구독권 갱신 해지
  const handleDiscontinue = () => {
    if (router.params.type === "TICKET") return;

    discontinueSubscription(
      {
        data: {
          id: router.params.id,
        },
      },
      {
        onSuccess: () => {
          subscriptionRefetch();
          setShowDicontinueModal(false);
          SuccessToast(t("detail.discontinue.success"));
        },
        onError: (error: any) => {
          setErrorModal({
            visible: true,
            message: error?.message ?? t("detail.discontinue.error"),
          });

          setShowDicontinueModal(false);
        },
      },
    );
  };

  // 구독권 재구독
  const handleResubscribe = () => {
    if (router.params.type === "TICKET") return;

    resubscribeSubscription(
      {
        data: {
          id: router.params.id,
        },
      },
      {
        onSuccess: () => {
          subscriptionRefetch();
          setShowResubscribeModal(false);
          SuccessToast(t("detail.resubscribe.success"));
        },
        onError: (error: any) => {
          setErrorModal({
            visible: true,
            message: error?.message ?? t("detail.resubscribe.error"),
          });

          setShowResubscribeModal(false);
        },
      },
    );
  };

  // getResponsive 함수 애니메이션 함수 안에 넣을 시 에러 발생
  const passTermsInitialHeight = getResponsiveSize(56);
  const passTermsHeight = getResponsiveSize(330);
  const refundTermsInitialHeight = getResponsiveSize(56);
  const refundTermsHeight = getResponsiveSize(330);

  // 이용권 유의사항 애니메이션
  const passTermsAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(
        passTermsOpen ? passTermsHeight : passTermsInitialHeight,
        {
          duration: 300,
        },
      ),
    };
  });
  const passTermsArrowAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(passTermsOpen ? "180deg" : "0deg", {
            duration: 300,
          }),
        },
      ],
    };
  });

  // 환불 유의사항 애니메이션
  const refundTermsAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(
        refundTermsOpen ? refundTermsHeight : refundTermsInitialHeight,
        {
          duration: 300,
        },
      ),
    };
  });
  const refundTermsArrowAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withTiming(refundTermsOpen ? "180deg" : "0deg", {
            duration: 300,
          }),
        },
      ],
    };
  });

  return (
    <View>
      <CustomModal
        visible={showDiscontinueModal}
        onClose={() => setShowDicontinueModal(false)}
        closeButtonText={t("common:cancel")}
        onNext={handleDiscontinue}
        isNextButtonDisable={discontinueSubscriptionLoading}
        nextButtonText={t("detail.discontinue.confirmButton")}
      >
        <CustomText fontSize={18} fontWeight={"600"}>
          {t("detail.discontinue.modalTitle")}
        </CustomText>

        <CustomText marginTop={8} textAlign="center" fontSize={16}>
          {t("detail.discontinue.modalMessage")}
        </CustomText>

        <CustomText marginTop={16} fontSize={16}>
          {t("detail.discontinue.modalConfirm")}
        </CustomText>
      </CustomModal>

      <CustomModal
        visible={showResubscribeModal}
        onClose={() => setShowResubscribeModal(false)}
        closeButtonText={t("common:cancel")}
        onNext={handleResubscribe}
        isNextButtonDisable={discontinueSubscriptionLoading}
        nextButtonText={t("detail.resubscribe.confirmButton")}
      >
        <CustomText fontSize={18} fontWeight={"600"}>
          {t("detail.resubscribe.modalTitle")}
        </CustomText>

        <CustomText marginTop={8} fontSize={16}>
          {t("detail.resubscribe.modalMessage")}
        </CustomText>
      </CustomModal>

      <ScrollView style={styles.container}>
        <CustomText fontSize={18} fontWeight={"600"}>
          {t("detail.storeInfo")}
        </CustomText>

        <Pressable onPress={handleRouteMyStoreDetail} style={styles.storeInfo}>
          <Image
            source={
              data.store.mainImage
                ? { uri: data.store.mainImage }
                : defaultStoreImage
            }
            style={styles.storeImage}
          />

          <View>
            <CustomText fontSize={18} fontWeight={"600"}>
              {data.store.name}
            </CustomText>

            <View style={styles.address}>
              <Image
                source={locationIcon}
                style={{
                  width: getResponsiveSize(16),
                  height: getResponsiveSize(16),
                }}
              />

              <CustomText marginLeft={2} color={colors.gray7} fontSize={14}>
                {getDistance(
                  coordinate.lat,
                  coordinate.lng,
                  data.store.lat,
                  data.store.lng,
                )}
                km
              </CustomText>

              <View style={styles.divider} />

              <CustomText marginLeft={2} color={colors.gray7} fontSize={14}>
                {formatEllipsis(data.store.address, 16)}
              </CustomText>
            </View>
          </View>
        </Pressable>

        <View style={styles.box}>
          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("labels.washService")}
            </CustomText>
            <CustomText fontSize={16}>
              {formatServiceType(data.serviceType)}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("labels.pass")}
            </CustomText>
            <CustomText fontSize={16}>{formatPassType(data.type)}</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("labels.store")}
            </CustomText>
            <CustomText fontSize={16}>{data.store.name}</CustomText>
          </View>

          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("labels.carNumber")}
            </CustomText>
            <CustomText fontSize={16}>{data.carNumber}</CustomText>
          </View>
        </View>

        <CustomText marginTop={40} fontSize={18} fontWeight={"600"}>
          {t("detail.passInfo")}
        </CustomText>

        <View style={styles.box}>
          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("labels.usagePeriod")}
            </CustomText>
            <CustomText fontSize={16}>
              {getAvailablePeriod(data.paidAt, data.billingDate)}
            </CustomText>
          </View>

          {data.type === "STANDARD" && (
            <View style={styles.row}>
              <CustomText color={colors.gray5} fontSize={16}>
                {t("labels.remainingCount")}
              </CustomText>

              <View style={{ flexDirection: "row" }}>
                <CustomText
                  color={
                    formatUsageLeft(
                      data.subscriptionSnapshot.usage ?? 0,
                      data.subscriptionSnapshot.maxUsage ?? 0,
                    ) > 0
                      ? colors.point2
                      : colors.gray5
                  }
                  fontSize={15}
                  fontWeight={"500"}
                >
                  {formatUsageLeft(
                    data.subscriptionSnapshot.usage ?? 0,
                    data.subscriptionSnapshot.maxUsage ?? 0,
                  )}
                </CustomText>
                <CustomText fontSize={15} fontWeight={"500"}>
                  {t("labels.countOf", {
                    max: data.subscriptionSnapshot.maxUsage,
                  })}
                </CustomText>
              </View>
            </View>
          )}

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("detail.nextBillingDate")}
            </CustomText>
            <CustomText fontSize={16}>
              {data.status === "ACTIVE"
                ? `${dayjs(data.paidAt).add(1, "month").format("YY.MM.")}${String(
                    data.billingDate,
                  ).padStart(2, "0")}`
                : "-"}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("detail.expectedAmount")}
            </CustomText>
            <CustomText fontSize={16}>
              {t("common:currency", { amount: data.amount.toLocaleString() })}
            </CustomText>
          </View>

          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("detail.paymentMethod")}
            </CustomText>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CustomText fontSize={16}>
                {formatCardCompany(data.cardCompany)} {data.cardDisplayNumber}
              </CustomText>

              <CardChangeButton
                subscriptionId={router.params.id}
                cardCompany={data.cardCompany}
                cardDisplayNumber={data.cardDisplayNumber}
                subscriptionRefetch={subscriptionRefetch}
              />
            </View>
          </View>
        </View>

        <Animated.View style={[styles.terms, passTermsAnimatedStyle]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomText fontSize={16} fontWeight={"600"}>
              {t("detail.terms.pass")}
            </CustomText>

            <Pressable onPress={() => setPassTermsOpen(!passTermsOpen)}>
              <Animated.Image
                source={termsArrow}
                style={[styles.arrowIcon, passTermsArrowAnimatedStyle]}
              />
            </Pressable>
          </View>

          <View style={styles.rowDivider} />

          <CustomText fontSize={14}>{t("detail.terms.paymentInfo")}</CustomText>
          <CustomText marginTop={4} color={colors.gray5} fontSize={14}>
            {t("detail.terms.fullRefundBeforeStart")}
          </CustomText>
          <CustomText color={colors.gray5} fontSize={14}>
            {t("detail.terms.deductUsage")}
          </CustomText>
          <CustomText color={colors.gray5} fontSize={14}>
            {t("detail.terms.premiumMemberUsage")}
          </CustomText>

          <CustomText marginTop={20} fontSize={14}>
            {t("detail.terms.cancelSubscription")}
          </CustomText>
          <CustomText marginTop={4} color={colors.gray5} fontSize={14}>
            {t("detail.terms.fullRefundBeforeStart")}
          </CustomText>
          <CustomText color={colors.gray5} fontSize={14}>
            {t("detail.terms.deductUsage")}
          </CustomText>
          <CustomText color={colors.gray5} fontSize={14}>
            {t("detail.terms.premiumMemberUsage")}
          </CustomText>
        </Animated.View>

        {data.status === "ACTIVE" && (
          <CustomButton
            onPress={() => setShowDicontinueModal(true)}
            height={getResponsiveSize(50)}
            marginTop={20}
            borderWidth={1}
            borderColor={colors.gray2}
          >
            <CustomText fontSize={16} fontWeight={"600"}>
              {t("detail.discontinue.button")}
            </CustomText>
          </CustomButton>
        )}

        {data.status === "DISCONTINUED" && (
          <CustomButton
            onPress={() => setShowResubscribeModal(true)}
            height={getResponsiveSize(50)}
            marginTop={20}
            borderWidth={1}
            borderColor={colors.gray2}
          >
            <CustomText fontSize={16} fontWeight={"600"}>
              {t("detail.resubscribe.button")}
            </CustomText>
          </CustomButton>
        )}

        <Animated.View style={[styles.terms, refundTermsAnimatedStyle]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CustomText fontSize={16} fontWeight={"600"}>
              {t("detail.terms.refund")}
            </CustomText>

            <Pressable onPress={() => setRefundTermsOpen(!refundTermsOpen)}>
              <Animated.Image
                source={termsArrow}
                style={[styles.arrowIcon, refundTermsArrowAnimatedStyle]}
              />
            </Pressable>
          </View>

          <View style={styles.rowDivider} />

          <CustomText fontSize={14}>{t("detail.terms.paymentInfo")}</CustomText>
          <CustomText marginTop={4} color={colors.gray5} fontSize={14}>
            {t("detail.terms.fullRefundBeforeStart")}
          </CustomText>
          <CustomText color={colors.gray5} fontSize={14}>
            {t("detail.terms.deductUsage")}
          </CustomText>
          <CustomText color={colors.gray5} fontSize={14}>
            {t("detail.terms.premiumMemberUsage")}
          </CustomText>

          <CustomText marginTop={20} fontSize={14}>
            {t("detail.terms.paymentInfo")}
          </CustomText>
          <CustomText marginTop={4} color={colors.gray5} fontSize={14}>
            {t("detail.terms.fullRefundBeforeStart")}
          </CustomText>
          <CustomText color={colors.gray5} fontSize={14}>
            {t("detail.terms.deductUsage")}
          </CustomText>
          <CustomText color={colors.gray5} fontSize={14}>
            {t("detail.terms.premiumMemberUsage")}
          </CustomText>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(20),
  },
  storeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(12),
    padding: getResponsiveSize(12),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  storeImage: {
    width: getResponsiveSize(68),
    height: getResponsiveSize(68),
    marginRight: 12,
    borderRadius: 12,
  },
  address: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(4),
  },
  divider: {
    width: 1,
    height: getResponsiveSize(12),
    backgroundColor: colors.gray2,
    marginHorizontal: getResponsiveSize(6),
  },
  box: {
    marginTop: getResponsiveSize(20),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: getResponsiveSize(10),
    paddingHorizontal: getResponsiveSize(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  terms: {
    marginTop: getResponsiveSize(40),
    padding: getResponsiveSize(16),
    backgroundColor: colors.gray1,
    borderRadius: 8,
    overflow: "hidden",
  },
  arrowIcon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
  rowDivider: {
    width: "100%",
    height: 1,
    marginVertical: getResponsiveSize(16),
    backgroundColor: colors.gray2,
  },
});
