import dayjs from "dayjs";
import { completeIcon } from "@/assets/images";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList, QrScanStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { formatPassType, formatServiceType, getResponsiveSize } from "@/utils";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

type QrScanRouteProp = RouteProp<QrScanStackParamList, "UsePassCompelete">;

export const UsePassComplete = () => {
  const { t } = useTranslation("scan");

  const router = useRoute<QrScanRouteProp>();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const handleRouteHome = () => {
    return containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "BottomTab",
            params: { screen: "Home" },
          },
        ],
      })
    );
  };

  const handleRouteServiceHistory = () => {
    return containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "ServiceHistory",
          },
        ],
      })
    );
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <View style={styles.container}>
        <Image
          source={completeIcon}
          style={{
            width: getResponsiveSize(60),
            height: getResponsiveSize(60),
          }}
        />
        <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
          {t("usePassComplete.title")}
        </CustomText>

        <CustomText
          marginTop={8}
          textAlign="center"
          color={colors.point2}
          fontSize={18}
          fontWeight={"500"}
        >
          {t("usePassComplete.description")}
        </CustomText>

        <View style={styles.buttonArea}>
          <CustomButton
            onPress={handleRouteServiceHistory}
            flex={1}
            height={getResponsiveSize(50)}
            backgroundColor={colors.white}
            borderColor={colors.gray2}
            borderWidth={1}
          >
            <CustomText fontSize={16} fontWeight={"600"}>
              {t("usePassComplete.viewHistory")}
            </CustomText>
          </CustomButton>

          <CustomButton
            onPress={handleRouteHome}
            flex={1}
            height={getResponsiveSize(50)}
            backgroundColor={colors.point2}
            borderColor={colors.gray2}
            borderWidth={1}
          >
            <CustomText color={colors.white} fontSize={16} fontWeight={"600"}>
              {t("goHome")}
            </CustomText>
          </CustomButton>
        </View>

        <View style={styles.receipt}>
          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("usePassComplete.service")}
            </CustomText>
            <CustomText fontSize={16}>
              {formatServiceType(router.params.serviceType)}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("usePassComplete.pass")}
            </CustomText>
            <CustomText fontSize={16}>
              {formatPassType(router.params.passType)}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("store")}
            </CustomText>
            <CustomText fontSize={16}>{router.params.storeName}</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("usePassComplete.carNumber")}
            </CustomText>
            <CustomText fontSize={16}>{router.params.carNumber}</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("usePassComplete.carInfo")}
            </CustomText>
            <CustomText fontSize={16}>
              {router.params.carBrand} {router.params.carModel}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("usePassComplete.usedAt")}
            </CustomText>
            <CustomText fontSize={16}>
              {dayjs(router.params.approvedAt).format("YYYY.MM.DD HH:mm")}
            </CustomText>
          </View>
        </View>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(20),
  },
  buttonArea: {
    flexDirection: "row",
    marginTop: getResponsiveSize(40),
    gap: getResponsiveSize(16),
  },
  receipt: {
    width: "100%",
    marginTop: getResponsiveSize(40),
    paddingVertical: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(16),
    gap: getResponsiveSize(12),
    backgroundColor: colors.gray1,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
