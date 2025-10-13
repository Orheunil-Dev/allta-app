import { Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PassStackParamList } from "@/navigations";
import {
  formatPassType,
  formatServiceType,
  formatUsageLeft,
  getResponsiveSize,
} from "@/utils";
import { PassType, ServiceType } from "@/types";
import { CustomText } from "../CustomText";
import { blackRightArrow } from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  id: string;
  type: PassType;
  serviceType: ServiceType;
  storeName: string;
  usage?: number;
  maxUsage?: number;
  availablePeriod: string;
}

export const MyPassCard = ({
  id,
  type,
  serviceType,
  storeName,
  availablePeriod,
  usage,
  maxUsage,
}: Props) => {
  const passStackNavigation =
    useNavigation<NativeStackNavigationProp<PassStackParamList>>();

  const handleRoutePassDetail = () => {};

  return (
    <View key={id} style={styles.card}>
      <View style={styles.top}>
        <View style={{ flexDirection: "row" }}>
          <CustomText fontSize={16} fontWeight={"600"}>
            {formatServiceType(serviceType)} {formatPassType(type)}
          </CustomText>
        </View>

        <Pressable onPress={handleRoutePassDetail}>
          <Image
            source={blackRightArrow}
            style={{
              width: getResponsiveSize(24),
              height: getResponsiveSize(24),
            }}
          />
        </Pressable>
      </View>

      <View style={styles.bottom}>
        <View style={styles.row}>
          <CustomText color={colors.gray5} fontSize={15} fontWeight={"500"}>
            매장
          </CustomText>

          <View style={{ flexDirection: "row" }}>
            <CustomText fontSize={15} fontWeight={"500"}>
              {storeName}
            </CustomText>
          </View>
        </View>

        <View style={styles.row}>
          <CustomText color={colors.gray5} fontSize={15} fontWeight={"500"}>
            사용기한
          </CustomText>

          <View style={{ flexDirection: "row" }}>
            <CustomText fontSize={15} fontWeight={"500"}>
              {availablePeriod}
            </CustomText>
          </View>
        </View>

        {type === "STANDARD" && (
          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={15} fontWeight={"500"}>
              남은 횟수
            </CustomText>

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
                {formatUsageLeft(usage ?? 0, maxUsage ?? 0)}
              </CustomText>
              <CustomText fontSize={15} fontWeight={"500"}>
                /{maxUsage} 회
              </CustomText>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    marginTop: getResponsiveSize(20),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(16),
    backgroundColor: colors.back4,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.point2,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  bottom: {
    paddingVertical: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.point2,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: getResponsiveSize(6),
  },
});
