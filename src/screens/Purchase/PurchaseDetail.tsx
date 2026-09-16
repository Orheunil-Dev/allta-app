import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RouteProp, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { usePurchaseControllerGetPurchaseDetail } from "@/api/purchase/purchase";
import { PurchaseStackParamList } from "@/navigations";
import {
  formatCardCompany,
  formatCardDisplayNumber,
  formatPassType,
  formatPaymentStatus,
  formatServiceType,
  getResponsiveSize,
} from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";

type PurchaseDetailRouteProp = RouteProp<
  PurchaseStackParamList,
  "PurchaseDetail"
>;

export const PurchaseDetail = () => {
  const router = useRoute<PurchaseDetailRouteProp>();
  const { t } = useTranslation("pass");

  const {
    data: purchaseData,
    isLoading: purchaseLoading,
    isError: purchaseError,
  } = usePurchaseControllerGetPurchaseDetail(router.params.id, {
    query: { enabled: !!router.params.id },
  });

  const renderPayment =
    (paymentStatus: string, amount: number, createdAt: string) => () => {
      if (!purchaseData) return;

      switch (paymentStatus) {
        case "APPROVED":
          return (
            <View key={String(createdAt)} style={styles.box}>
              <CustomText fontSize={18} fontWeight={"600"}>
                {t("purchase.detail.paymentInfo")}
              </CustomText>

              <View style={styles.content}>
                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.passAmount")}
                  </CustomText>
                  <CustomText fontSize={16}>
                    {t("common:currency", {
                      amount: purchaseData.data.originalAmount.toLocaleString(),
                    })}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.couponDiscount")}
                  </CustomText>
                  <CustomText fontSize={16}>
                    -{" "}
                    {t("common:currency", {
                      amount: purchaseData.data.discountAmount.toLocaleString(),
                    })}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.totalAmount")}
                  </CustomText>
                  <CustomText
                    color={colors.point2}
                    fontSize={20}
                    fontWeight={"600"}
                  >
                    {t("common:currency", {
                      amount: purchaseData.data.totalAmount.toLocaleString(),
                    })}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.paymentMethod")}
                  </CustomText>
                  <CustomText fontSize={16}>
                    {formatCardCompany(purchaseData.data.cardCompany)}{" "}
                    {formatCardDisplayNumber(
                      purchaseData.data.cardDisplayNumber
                    )}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.paidAt")}
                  </CustomText>
                  <CustomText fontSize={16}>
                    {dayjs(createdAt).format("YYYY.MM.DD HH:mm")}
                  </CustomText>
                </View>
              </View>
            </View>
          );

        case "PARTIAL_REFUNDED":
          return (
            <View key={String(createdAt)} style={styles.box}>
              <CustomText fontSize={18} fontWeight={"600"}>
                {t("purchase.detail.partialRefundInfo")}
              </CustomText>

              <View style={styles.content}>
                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.totalAmount")}
                  </CustomText>
                  <CustomText fontSize={16}>
                    {t("common:currency", {
                      amount: purchaseData.data.totalAmount.toLocaleString(),
                    })}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.refundAmount")}
                  </CustomText>
                  <CustomText
                    color={colors.point2}
                    fontSize={20}
                    fontWeight={"600"}
                  >
                    -
                    {t("common:currency", {
                      amount: amount.toLocaleString(),
                    })}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.refundMethod")}
                  </CustomText>
                  <CustomText fontSize={16}>
                    {formatCardCompany(purchaseData.data.cardCompany)}{" "}
                    {formatCardDisplayNumber(
                      purchaseData.data.cardDisplayNumber
                    )}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.refundedAt")}
                  </CustomText>
                  <CustomText fontSize={16}>
                    {dayjs(createdAt).format("YYYY.MM.DD HH:mm")}
                  </CustomText>
                </View>
              </View>
            </View>
          );

        case "REFUNDED":
          return (
            <View key={String(createdAt)} style={styles.box}>
              <CustomText fontSize={18} fontWeight={"600"}>
                {t("purchase.detail.fullRefundInfo")}
              </CustomText>

              <View style={styles.content}>
                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.totalAmount")}
                  </CustomText>
                  <CustomText fontSize={16}>
                    {t("common:currency", {
                      amount: purchaseData.data.totalAmount.toLocaleString(),
                    })}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.refundAmount")}
                  </CustomText>
                  <CustomText
                    color={colors.point2}
                    fontSize={20}
                    fontWeight={"600"}
                  >
                    -
                    {t("common:currency", {
                      amount: amount.toLocaleString(),
                    })}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.refundMethod")}
                  </CustomText>
                  <CustomText fontSize={16}>
                    {formatCardCompany(purchaseData.data.cardCompany)}{" "}
                    {formatCardDisplayNumber(
                      purchaseData.data.cardDisplayNumber
                    )}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    {t("purchase.detail.refundedAt")}
                  </CustomText>
                  <CustomText fontSize={16}>
                    {dayjs(createdAt).format("YYYY.MM.DD HH:mm")}
                  </CustomText>
                </View>
              </View>
            </View>
          );

        default:
          return;
      }
    };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      {purchaseData && (
        <ScrollView style={styles.container}>
          <View style={[styles.box, { paddingTop: getResponsiveSize(20) }]}>
            <CustomText fontSize={18} fontWeight={"600"}>
              {dayjs(purchaseData.data.createdAt).format("YYYY.MM.DD")}
            </CustomText>

            <View
              style={{ flexDirection: "row", marginTop: getResponsiveSize(4) }}
            >
              <CustomText
                color={
                  purchaseData.data.status === "APPROVED"
                    ? colors.gray5
                    : colors.red
                }
                fontSize={16}
              >
                {formatPaymentStatus(purchaseData.data.status)}
              </CustomText>
              <CustomText color={colors.gray5} fontSize={16}>
                {purchaseData.data.status === "APPROVED"
                  ? t("purchase.detail.completed.approved")
                  : t("purchase.detail.completed.refunded")}
              </CustomText>
            </View>
          </View>

          <View style={styles.box}>
            <CustomText fontSize={18} fontWeight={"600"}>
              {t("purchase.detail.passInfo")}
            </CustomText>

            <View style={styles.content}>
              <View style={styles.row}>
                <CustomText color={colors.gray5} fontSize={16}>
                  {t("labels.washService")}
                </CustomText>
                <CustomText fontSize={16}>
                  {formatServiceType(purchaseData.data.serviceType)}
                </CustomText>
              </View>

              <View style={styles.row}>
                <CustomText color={colors.gray5} fontSize={16}>
                  {t("labels.pass")}
                </CustomText>
                <CustomText fontSize={16}>
                  {formatPassType(purchaseData.data.productType)}
                </CustomText>
              </View>

              <View style={styles.row}>
                <CustomText color={colors.gray5} fontSize={16}>
                  {t("labels.store")}
                </CustomText>
                <CustomText fontSize={16}>
                  {purchaseData.data.storeName}
                </CustomText>
              </View>

              <View style={styles.row}>
                <CustomText color={colors.gray5} fontSize={16}>
                  {t("purchase.detail.registeredCar")}
                </CustomText>
                <CustomText fontSize={16}>
                  {purchaseData.data.carNumber}
                </CustomText>
              </View>
            </View>
          </View>

          {purchaseData.data.payments.map((value, index) =>
            renderPayment(value.status, value.amount, value.createdAt)()
          )}
        </ScrollView>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
  },
  box: {
    marginBottom: getResponsiveSize(40),
    paddingBottom: getResponsiveSize(40),
    borderBottomWidth: 6,
    borderBottomColor: colors.gray1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    marginTop: getResponsiveSize(12),
    gap: getResponsiveSize(8),
  },
});
