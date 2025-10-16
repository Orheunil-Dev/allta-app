import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RouteProp, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
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
                결제 정보
              </CustomText>

              <View style={styles.content}>
                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    이용권 금액
                  </CustomText>
                  <CustomText fontSize={16}>
                    {purchaseData.data.originalAmount.toLocaleString()}원
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    쿠폰 할인
                  </CustomText>
                  <CustomText fontSize={16}>
                    - {purchaseData.data.discountAmount.toLocaleString()}원
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    결제 금액
                  </CustomText>
                  <CustomText
                    color={colors.point2}
                    fontSize={20}
                    fontWeight={"600"}
                  >
                    {purchaseData.data.totalAmount.toLocaleString()}원
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    결제 방법
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
                    결제 일시
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
                부분 환불 정보
              </CustomText>

              <View style={styles.content}>
                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    결제 금액
                  </CustomText>
                  <CustomText fontSize={16}>
                    {purchaseData.data.totalAmount.toLocaleString()}원
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    환불 금액
                  </CustomText>
                  <CustomText
                    color={colors.point2}
                    fontSize={20}
                    fontWeight={"600"}
                  >
                    -{amount.toLocaleString()}원
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    환불 방법
                  </CustomText>
                  <CustomText fontSize={16}>
                    {formatCardCompany(purchaseData.data.cardCompany)}{" "}
                    {purchaseData.data.cardDisplayNumber}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    환불 일시
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
                전체 환불 정보
              </CustomText>

              <View style={styles.content}>
                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    결제 금액
                  </CustomText>
                  <CustomText fontSize={16}>
                    {purchaseData.data.totalAmount.toLocaleString()}원
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    환불 금액
                  </CustomText>
                  <CustomText
                    color={colors.point2}
                    fontSize={20}
                    fontWeight={"600"}
                  >
                    -{amount.toLocaleString()}원
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    환불 방법
                  </CustomText>
                  <CustomText fontSize={16}>
                    {formatCardCompany(purchaseData.data.cardCompany)}{" "}
                    {purchaseData.data.cardDisplayNumber}
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray5} fontSize={16}>
                    환불 일시
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
                {purchaseData.data.status === "APPROVED" ? "가" : "이"} 완료
                되었습니다.
              </CustomText>
            </View>
          </View>

          <View style={styles.box}>
            <CustomText fontSize={18} fontWeight={"600"}>
              이용권 정보
            </CustomText>

            <View style={styles.content}>
              <View style={styles.row}>
                <CustomText color={colors.gray5} fontSize={16}>
                  세차 서비스
                </CustomText>
                <CustomText fontSize={16}>
                  {formatServiceType(purchaseData.data.serviceType)}
                </CustomText>
              </View>

              <View style={styles.row}>
                <CustomText color={colors.gray5} fontSize={16}>
                  이용권
                </CustomText>
                <CustomText fontSize={16}>
                  {formatPassType(purchaseData.data.productType)}
                </CustomText>
              </View>

              <View style={styles.row}>
                <CustomText color={colors.gray5} fontSize={16}>
                  매장
                </CustomText>
                <CustomText fontSize={16}>
                  {purchaseData.data.storeName}
                </CustomText>
              </View>

              <View style={styles.row}>
                <CustomText color={colors.gray5} fontSize={16}>
                  등록 차량
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
