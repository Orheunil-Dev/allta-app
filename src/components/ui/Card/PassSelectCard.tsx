import { Image, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { CustomText } from "../CustomText";
import { termsCheckedIcon, uncheckedIconGray2 } from "@/assets/images";
import { formatUsageLeft, getResponsiveSize } from "@/utils";
import { colors } from "@/styles";

interface Props {
  type: "TICKET" | "STANDARD" | "PREMIUM";
  name: string;
  onPress: () => void;
  usage?: number;
  maxUsage?: number;
  availablePeriod?: string;
  isAvailable?: boolean;
  isSelected: boolean;
}

export const PassSelectCard = ({
  type,
  name,
  usage,
  maxUsage,
  availablePeriod,
  onPress,
  isAvailable = true,
  isSelected,
}: Props) => {
  const { t } = useTranslation("pass");

  const renderUsage = () => {
    switch (type) {
      case "TICKET":
        return (
          <View style={{ flexDirection: "row" }}>
            <CustomText color={colors.point2} fontSize={15} fontWeight={"500"}>
              1
            </CustomText>
            <CustomText fontSize={15} fontWeight={"500"}>
              {t("labels.countOf", { max: 1 })}
            </CustomText>
          </View>
        );

      case "STANDARD":
        return (
          <View style={{ flexDirection: "row" }}>
            <CustomText
              color={
                formatUsageLeft(usage ?? 0, maxUsage ?? 0) > 0
                  ? colors.point2
                  : colors.gray5
              }
              fontSize={15}
              fontWeight={"500"}
            >
              {`${formatUsageLeft(usage ?? 0, maxUsage ?? 0)}`}
            </CustomText>
            <CustomText fontSize={15} fontWeight={"500"}>
              {t("labels.countOf", { max: maxUsage })}
            </CustomText>
          </View>
        );

      case "PREMIUM":
        return (
          <View style={{ flexDirection: "row" }}>
            <CustomText fontSize={15} fontWeight={"500"}>
              {t("select.oncePerDay")}
            </CustomText>
          </View>
        );
    }
  };

  return (
    <Pressable
      disabled={!isAvailable}
      onPress={onPress}
      style={[
        styles.card,
        isSelected && { borderWidth: 2, borderColor: colors.point2 },
      ]}
    >
      {!isAvailable && (
        <View style={styles.disableLayout}>
          <CustomText color={colors.white} fontSize={16} fontWeight={"600"}>
            {type === "STANDARD"
              ? t("select.usedUp")
              : type === "PREMIUM"
              ? t("select.usedToday")
              : " "}
          </CustomText>
        </View>
      )}

      <View style={styles.top}>
        <CustomText fontSize={16} fontWeight={"600"}>
          {name}
        </CustomText>
        <Image
          source={isSelected ? termsCheckedIcon : uncheckedIconGray2}
          style={{
            width: getResponsiveSize(24),
            height: getResponsiveSize(24),
          }}
        />
      </View>
      <View style={styles.bottom}>
        <View style={styles.item}>
          <CustomText color={colors.gray5} fontSize={15} fontWeight={"500"}>
            {t("labels.remainingCount")}
          </CustomText>

          {renderUsage()}
        </View>

        <View style={styles.divider} />

        <View style={styles.item}>
          <CustomText color={colors.gray5} fontSize={15} fontWeight={"500"}>
            {t("labels.usagePeriod")}
          </CustomText>
          <CustomText fontSize={15} fontWeight={"500"}>
            {availablePeriod}
          </CustomText>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  disableLayout: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(38, 38, 39, 0.5)",
    borderRadius: 12,
    zIndex: 2,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: getResponsiveSize(16),
    paddingVertical: getResponsiveSize(10),
    backgroundColor: colors.back4,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  bottom: {
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(6),
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: getResponsiveSize(8),
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.line,
  },
});
