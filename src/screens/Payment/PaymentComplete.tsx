import { Image, StyleSheet, View } from "react-native";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { ContainerStackParamList, PaymentStackParamList } from "@/navigations";
import { formatPassType, formatServiceType, getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { completeIcon } from "@/assets/images";
import { colors } from "@/styles";

type PaymentRouteProp = RouteProp<PaymentStackParamList, "PaymentComplete">;

export const PaymentComplete = () => {
  const router = useRoute<PaymentRouteProp>();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const { t } = useTranslation("payment");

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
      }),
    );
  };

  const handleRoutePurchaseList = () => {
    return containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "PurchaseStack",
            params: { screen: "PurchaseList" },
          },
        ],
      }),
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
          {t("complete.title")}
        </CustomText>

        <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
          {t("complete.description")}
        </CustomText>

        <View style={styles.buttonArea}>
          <CustomButton
            onPress={handleRoutePurchaseList}
            flex={1}
            height={getResponsiveSize(53)}
            backgroundColor={colors.white}
            borderColor={colors.gray2}
            borderWidth={1}
          >
            <CustomText fontSize={18} fontWeight={"600"}>
              {t("complete.viewHistory")}
            </CustomText>
          </CustomButton>

          <CustomButton
            onPress={handleRouteHome}
            flex={1}
            height={getResponsiveSize(53)}
            backgroundColor={colors.point2}
            borderColor={colors.gray2}
            borderWidth={1}
          >
            <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
              {t("complete.goHome")}
            </CustomText>
          </CustomButton>
        </View>

        <View style={styles.receipt}>
          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("complete.service")}
            </CustomText>
            <CustomText fontSize={16}>
              {formatServiceType(router.params.serviceType)}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("complete.pass")}
            </CustomText>
            <CustomText fontSize={16}>
              {formatPassType(router.params.productType)}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("complete.store")}
            </CustomText>
            <CustomText fontSize={16}>{router.params.storeName}</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("complete.carNumber")}
            </CustomText>
            <CustomText fontSize={16}>{router.params.carNumber}</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("complete.paidAt")}
            </CustomText>
            <CustomText fontSize={16}>
              {dayjs(router.params.approvedAt).format("YYYY.MM.DD HH:mm")}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              {t("complete.amount")}
            </CustomText>
            <CustomText fontSize={16}>
              {t("common:currency", {
                amount: router.params.totalAmount.toLocaleString(),
              })}
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
  },
  buttonArea: {
    flexDirection: "row",
    marginTop: getResponsiveSize(40),
    gap: getResponsiveSize(16),
  },
  receipt: {
    width: "100%",
    marginTop: getResponsiveSize(40),
    padding: getResponsiveSize(16),
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
