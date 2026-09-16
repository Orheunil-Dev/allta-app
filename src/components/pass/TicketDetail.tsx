import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { GetTicketDetailResponse } from "@/api/models";
import { useDistanceCalculator } from "@/hooks";
import { formatEllipsis, formatServiceType, getResponsiveSize } from "@/utils";
import { CustomText } from "../ui/CustomText";
import { defaultStoreImage, locationIcon, termsArrow } from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  coordinate: {
    lat: number;
    lng: number;
  };
  data: GetTicketDetailResponse["data"];
  handleRouteMyStoreDetail: () => void;
}

export const TicketDetail = ({
  coordinate,
  data,
  handleRouteMyStoreDetail,
}: Props) => {
  const { t } = useTranslation("pass");

  const [passTermsOpen, setPassTermsOpen] = useState<boolean>(false);
  const [refundTermsOpen, setRefundTermsOpen] = useState<boolean>(false);

  const { getDistance } = useDistanceCalculator();

  // getResponsive 함수 애니메이션 함수 안에 넣을 시 에러 발생
  const passTermsInitialHeight = getResponsiveSize(56);
  const passTermsHeight = getResponsiveSize(200);
  const refundTermsInitialHeight = getResponsiveSize(56);
  const refundTermsHeight = getResponsiveSize(200);

  // 이용권 유의사항 애니메이션
  const passTermsAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(
        passTermsOpen ? passTermsHeight : passTermsInitialHeight,
        {
          duration: 300,
        }
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
        }
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
                  data.store.lng
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
            <CustomText fontSize={16}>{t("format:passType.ticket")}</CustomText>
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
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("labels.usagePeriod")}
            </CustomText>
            <CustomText fontSize={16}>
              {`${dayjs(data.createdAt).format("YY.MM.DD")}~${dayjs(
                data.expiredAt
              ).format("YY.MM.DD")}`}
            </CustomText>
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
        </Animated.View>

        <Animated.View style={[styles.refundTerms, refundTermsAnimatedStyle]}>
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
  refundTerms: {
    marginTop: getResponsiveSize(20),
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
