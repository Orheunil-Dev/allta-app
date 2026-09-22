import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { checkIcon, grayDownArrow } from "@/assets/images";
import { colors } from "@/styles";
import { PassPrice, ServiceType, StoreDetailItemPassPrice } from "@/types";

type PassType = "PREMIUM" | "STANDARD" | "TICKET";

interface Props {
  serviceType: ServiceType;
  pass: PassType | undefined;
  onPressPass: (passType: PassType) => () => void;
  standardMaxUsage?: number | undefined;
  passPrice: StoreDetailItemPassPrice | undefined;
}

const accordianHeight = getResponsiveSize(90);

export const PassInfo = ({
  serviceType,
  pass,
  onPressPass,
  standardMaxUsage,
  passPrice,
}: Props) => {
  const { t } = useTranslation("store");

  const [showPolicy, setShowPolicy] = useState<PassType | undefined>(undefined);

  const prices = passPrice?.[serviceType] as PassPrice;

  const handleOpenPolicy = (passType: PassType) => () => {
    if (passType === showPolicy) {
      return setShowPolicy(undefined);
    }

    return setShowPolicy(passType);
  };

  const rotateAnimatedStyle = (passType: PassType) =>
    useAnimatedStyle(() => {
      return {
        transform: [
          {
            rotate: withTiming(showPolicy === passType ? "180deg" : "0deg", {
              duration: 300,
            }),
          },
        ],
      };
    });

  const accordianAnimatedStyle = (passType: PassType) =>
    useAnimatedStyle(() => {
      return {
        height: withTiming(showPolicy === passType ? accordianHeight : 0, {
          duration: 300,
        }),
      };
    });

  return (
    <View style={styles.container}>
      <View style={{ gap: getResponsiveSize(16) }}>
        {prices?.PREMIUM && (
          <View
            style={[
              styles.card,
              pass === "PREMIUM" && {
                borderWidth: 2,
                borderColor: colors.point2,
              },
            ]}
          >
            <Pressable onPress={onPressPass("PREMIUM")}>
              <CustomText fontSize={16} fontWeight={"600"}>
                {t("pass.premium.title")}
              </CustomText>
              <CustomText
                marginTop={4}
                marginBottom={8}
                color={colors.point2}
                fontSize={20}
                fontWeight={"600"}
              >
                {t("pass.monthlyPriceFrom", {
                  price: Math.min(
                    ...Object.values(prices.PREMIUM)
                  ).toLocaleString(),
                })}
              </CustomText>

              <View style={styles.row}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={15}>
                  {t("pass.premium.dailyWash")}
                </CustomText>
              </View>

              <View style={[styles.row, { marginTop: getResponsiveSize(4) }]}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={15}>
                  {t("pass.premium.autoBilling")}
                </CustomText>
              </View>
            </Pressable>

            <View style={styles.divider} />

            <Pressable onPress={handleOpenPolicy("PREMIUM")}>
              <View style={styles.accordianButton}>
                <CustomText
                  color={colors.gray5}
                  fontSize={15}
                  fontWeight={"500"}
                >
                  {t("pass.guide")}
                </CustomText>

                <Animated.Image
                  source={grayDownArrow}
                  style={[styles.arrow, rotateAnimatedStyle("PREMIUM")]}
                />
              </View>

              <Animated.View
                style={[styles.accordianBox, accordianAnimatedStyle("PREMIUM")]}
              >
                <CustomText color={colors.gray5} fontSize={13}>
                  {t("pass.policy.noTransfer")}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={13}>
                  {t("pass.policy.premiumUsage")}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={13}>
                  {t("pass.policy.singleCar")}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={13}>
                  {t("pass.policy.storeNotice")}
                </CustomText>
              </Animated.View>
            </Pressable>
          </View>
        )}

        {prices?.STANDARD && (
          <View
            style={[
              styles.card,
              pass === "STANDARD" && {
                borderWidth: 2,
                borderColor: colors.point2,
              },
            ]}
          >
            <Pressable onPress={onPressPass("STANDARD")}>
              <CustomText fontSize={16} fontWeight={"600"}>
                {t("pass.standard.title")}
              </CustomText>
              <CustomText
                marginTop={4}
                marginBottom={8}
                color={colors.point2}
                fontSize={20}
                fontWeight={"600"}
              >
                {t("pass.monthlyPriceFrom", {
                  price: Math.min(
                    ...Object.values(prices.STANDARD)
                  ).toLocaleString(),
                })}
              </CustomText>

              <View style={styles.row}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={15}>
                  {t("pass.standard.monthlyWash", { count: standardMaxUsage })}
                </CustomText>
              </View>

              <View style={[styles.row, { marginTop: getResponsiveSize(4) }]}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={15}>
                  {t("pass.standard.reasonablePrice")}
                </CustomText>
              </View>
            </Pressable>

            <View style={styles.divider} />

            <View>
              <Pressable
                onPress={handleOpenPolicy("STANDARD")}
                style={styles.accordianButton}
              >
                <CustomText
                  color={colors.gray5}
                  fontSize={15}
                  fontWeight={"500"}
                >
                  {t("pass.guide")}
                </CustomText>

                <Animated.Image
                  source={grayDownArrow}
                  style={[styles.arrow, rotateAnimatedStyle("STANDARD")]}
                />
              </Pressable>

              <Animated.View
                style={[
                  styles.accordianBox,
                  accordianAnimatedStyle("STANDARD"),
                ]}
              >
                <CustomText color={colors.gray5} fontSize={13}>
                  {t("pass.policy.noTransfer")}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={13}>
                  {t("pass.policy.standardUsage", { count: standardMaxUsage })}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={13}>
                  {t("pass.policy.singleCar")}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={13}>
                  {t("pass.policy.storeNotice")}
                </CustomText>
              </Animated.View>
            </View>
          </View>
        )}

        {prices?.TICKET && (
          <View
            style={[
              styles.card,
              pass === "TICKET" && {
                borderWidth: 2,
                borderColor: colors.point2,
              },
            ]}
          >
            <Pressable onPress={onPressPass("TICKET")}>
              <CustomText fontSize={16} fontWeight={"600"}>
                {t("pass.ticket.title")}
              </CustomText>
              <CustomText
                marginTop={4}
                marginBottom={8}
                color={colors.point2}
                fontSize={20}
                fontWeight={"600"}
              >
                {t("priceFrom", {
                  price: Math.min(
                    ...Object.values(prices.TICKET)
                  ).toLocaleString(),
                })}
              </CustomText>

              <View style={styles.row}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={15}>
                  {t("pass.ticket.singleUse")}
                </CustomText>
              </View>

              <View style={[styles.row, { marginTop: getResponsiveSize(4) }]}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={15}>
                  {t("pass.ticket.anyDay")}
                </CustomText>
              </View>
            </Pressable>

            <View style={styles.divider} />

            <View>
              <Pressable
                onPress={handleOpenPolicy("TICKET")}
                style={styles.accordianButton}
              >
                <CustomText
                  color={colors.gray5}
                  fontSize={15}
                  fontWeight={"500"}
                >
                  {t("pass.guide")}
                </CustomText>

                <Animated.Image
                  source={grayDownArrow}
                  style={[styles.arrow, rotateAnimatedStyle("TICKET")]}
                />
              </Pressable>

              <Animated.View
                style={[styles.accordianBox, accordianAnimatedStyle("TICKET")]}
              >
                <CustomText color={colors.gray5} fontSize={14}>
                  {t("pass.policy.noTransfer")}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  {t("pass.policy.ticketUsage")}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  {t("pass.policy.singleCar")}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  {t("pass.policy.storeNotice")}
                </CustomText>
              </Animated.View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveSize(20),
  },
  card: {
    paddingTop: getResponsiveSize(14),
    paddingBottom: getResponsiveSize(8),
    paddingHorizontal: getResponsiveSize(16),
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
  check: {
    width: getResponsiveSize(15),
    height: getResponsiveSize(15),
    marginRight: getResponsiveSize(6),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.line,
    marginVertical: getResponsiveSize(8),
  },
  accordianButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordianBox: {
    overflow: "hidden",
    paddingTop: getResponsiveSize(4),
  },
  arrow: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
});
