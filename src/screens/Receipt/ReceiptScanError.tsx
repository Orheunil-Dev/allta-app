import { closeIcon, grayErrorIcon } from "@/assets/images";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import {
  ContainerStackParamList,
  ReceiptScanStackParamList,
} from "@/navigations";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

type ReceiptRouteProps = RouteProp<
  ReceiptScanStackParamList,
  "ReceiptScanError"
>;

export const ReceiptScanError = () => {
  const { t } = useTranslation("scan");

  const router = useRoute<ReceiptRouteProps>();

  const navigation = useNavigation();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const insets = useSafeAreaInsets();

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

  const renderErrorMessage = () => {
    switch (router.params.code) {
      case "001":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              {t("receiptScanError.recognitionFailed.title")}
            </CustomText>

            <CustomText
              marginTop={8}
              textAlign="center"
              color={colors.gray7}
              fontSize={16}
            >
              {t("receiptScanError.recognitionFailed.description")}
            </CustomText>
          </View>
        );

      case "002":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              {t("receiptScanError.duplicated.title")}
            </CustomText>

            <CustomText
              marginTop={8}
              textAlign="center"
              color={colors.gray7}
              fontSize={16}
            >
              {t("receiptScanError.duplicated.description")}
            </CustomText>
          </View>
        );

      case "003":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              {t("receiptScanError.notPartnerStore.title")}
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              {t("receiptScanError.notPartnerStore.description")}
            </CustomText>
          </View>
        );

      case "004":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              {t("receiptScanError.notGasDiscountStore.title")}
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              {t("receiptScanError.notGasDiscountStore.description")}
            </CustomText>
          </View>
        );

      case "005":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              {t("receiptScanError.insufficientAmount.title")}
            </CustomText>

            <CustomText
              marginTop={8}
              textAlign="center"
              color={colors.gray7}
              fontSize={16}
            >
              {t("receiptScanError.insufficientAmount.description", {
                minAmount: router.params.message,
              })}
            </CustomText>
          </View>
        );

      case "006":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              {t("receiptScanError.notGasDiscountStore.title")}
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              {t("receiptScanError.notGasDiscountStore.description")}
            </CustomText>
          </View>
        );

      case "007":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              {t("receiptScanError.expired.title")}
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              {router.params.message}
            </CustomText>
          </View>
        );

      default:
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              {t("receiptScanError.recognitionFailed.title")}
            </CustomText>

            <CustomText
              marginTop={8}
              textAlign="center"
              color={colors.gray7}
              fontSize={16}
            >
              {t("receiptScanError.recognitionFailed.description")}
            </CustomText>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleRouteHome}
        style={[styles.closeButton, { top: insets.top }]}
      >
        <Image
          source={closeIcon}
          style={{
            width: getResponsiveSize(28),
            height: getResponsiveSize(28),
          }}
        />
      </Pressable>

      <Image
        source={grayErrorIcon}
        style={{
          width: getResponsiveSize(60),
          height: getResponsiveSize(60),
        }}
      />

      {renderErrorMessage()}

      <View style={styles.buttonArea}>
        <CustomButton
          onPress={() => navigation.goBack()}
          flex={1}
          height={getResponsiveSize(53)}
          backgroundColor={colors.white}
          borderColor={colors.gray2}
          borderWidth={1}
        >
          <CustomText fontSize={18} fontWeight={"600"}>
            {t("receiptScanError.retake")}
          </CustomText>
        </CustomButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
  },
  closeButton: {
    position: "absolute",
    right: getResponsiveSize(20),
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
  errorMessage: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
