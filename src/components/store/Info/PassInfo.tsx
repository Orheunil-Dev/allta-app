import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { StoreDetailItemPassPrice } from "@/api/models";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { checkIcon, grayDownArrow } from "@/assets/images";
import { colors } from "@/styles";
import { ServiceType } from "@/types";

type PassType = "PREMIUM" | "STANDARD" | "TICKET";

type PassPrice = {
  TICKET?: Record<string, number>;
  STANDARD?: Record<string, number>;
  PREMIUM?: Record<string, number>;
};

interface Props {
  serviceType: ServiceType;
  pass: PassType | undefined;
  onPressPass: (passType: PassType) => () => void;
  standardMaxUsage?: number | undefined;
  passPrice: StoreDetailItemPassPrice | undefined;
}

const accordianHeight = getResponsiveSize(110);

export const PassInfo = ({
  serviceType,
  pass,
  onPressPass,
  standardMaxUsage,
  passPrice,
}: Props) => {
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
        {prices.PREMIUM && (
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
                프리미엄
              </CustomText>
              <CustomText
                marginTop={4}
                marginBottom={8}
                color={colors.point2}
                fontSize={20}
                fontWeight={"600"}
              >
                월 {Math.min(...Object.values(prices.PREMIUM)).toLocaleString()}
                원 ~
              </CustomText>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={16}>
                  한 달간 매일 세차 가능
                </CustomText>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={16}>
                  월마다 자동 결제
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
                  이용안내
                </CustomText>

                <Animated.Image
                  source={grayDownArrow}
                  style={[styles.arrow, rotateAnimatedStyle("PREMIUM")]}
                />
              </View>

              <Animated.View
                style={[styles.accordianBox, accordianAnimatedStyle("PREMIUM")]}
              >
                <CustomText color={colors.gray5} fontSize={14}>
                  이용권은 타인, 또는 다른 아이디(계정)로 양도불가
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 이용권에 표기된 매장에서 1일 1회 세차 가능
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 이용권당 표기된 차량 1대만 이용가능
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 차량번호는 30일 단위로 1회 변경 가능
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 추가로 각 매장별 별도 안내사항 참조
                </CustomText>
              </Animated.View>
            </Pressable>
          </View>
        )}

        {prices.STANDARD && (
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
                스탠다드
              </CustomText>
              <CustomText
                marginTop={4}
                marginBottom={8}
                color={colors.point2}
                fontSize={20}
                fontWeight={"600"}
              >
                월{" "}
                {Math.min(...Object.values(prices.STANDARD)).toLocaleString()}원
                ~
              </CustomText>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={16}>
                  월 {standardMaxUsage}회 세차 가능
                </CustomText>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={16}>
                  합리적인 가격으로 세차 가능
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
                  이용안내
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
                <CustomText color={colors.gray5} fontSize={14}>
                  이용권은 타인, 또는 다른 아이디(계정)로 양도불가
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 이용권에 표기된 매장에서 1일 1회 세차 가능
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 이용권당 표기된 차량 1대만 이용가능
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 차량번호는 30일 단위로 1회 변경 가능
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 추가로 각 매장별 별도 안내사항 참조
                </CustomText>
              </Animated.View>
            </View>
          </View>
        )}

        {prices.TICKET && (
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
                일회권
              </CustomText>
              <CustomText
                marginTop={4}
                marginBottom={8}
                color={colors.point2}
                fontSize={20}
                fontWeight={"600"}
              >
                월 {Math.min(...Object.values(prices.TICKET)).toLocaleString()}
                원 ~
              </CustomText>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={16}>
                  부담 없는 단일 이용권
                </CustomText>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={checkIcon} style={styles.check} />
                <CustomText color={colors.gray7} fontSize={16}>
                  원하는 날, 1회 세차
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
                  이용안내
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
                  이용권은 타인, 또는 다른 아이디(계정)로 양도불가
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 이용권에 표기된 매장에서 1일 1회 세차 가능
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 이용권당 표기된 차량 1대만 이용가능
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 차량번호는 30일 단위로 1회 변경 가능
                </CustomText>
                <CustomText color={colors.gray5} fontSize={14}>
                  · 추가로 각 매장별 별도 안내사항 참조
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
    paddingBottom: getResponsiveSize(10),
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
    width: getResponsiveSize(16),
    height: getResponsiveSize(16),
    marginRight: getResponsiveSize(6),
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
  },
  arrow: {
    width: getResponsiveSize(10),
    height: getResponsiveSize(5),
  },
});
