import { useStoreControllerGetStoreDetail } from "@/api/store/store";
import { grayErrorIcon } from "@/assets/images";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList, QrScanStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

type QrScanRouteProps = RouteProp<QrScanStackParamList, "QrScanError">;

interface PassPrice {
  AUTO?: Record<string, number>;
}

export const QrScanError = () => {
  const { t } = useTranslation("scan");

  const router = useRoute<QrScanRouteProps>();

  const navigation = useNavigation();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const {
    data: storeData,
    isLoading: storeLoading,
    isError: storeError,
  } = useStoreControllerGetStoreDetail(router.params.storeId, {
    query: { enabled: !!router.params.storeId },
  });

  // 이용권 구매 화면으로 이동
  const handleRouteStoreDetail = () => {
    if (!storeData) return;

    const passPrice = storeData?.store.passPrice as PassPrice;

    if (!passPrice?.AUTO) return handleRouteHome();

    return containerNavigation.navigate("StoreStack", {
      screen: "StoreDetail",
      params: {
        serviceType: "AUTO",
        storeId: storeData.store.id,
        storeName: storeData.store.name,
        ...(storeData.store.storeGroupId && {
          storeGroupId: storeData.store.storeGroupId,
        }),
      },
    });
  };

  // 홈으로 이동
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
              {t("qrScanError.invalidQr.title")}
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              {t("qrScanError.invalidQr.description")}
            </CustomText>
          </View>
        );

      case "002":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              {t("qrScanError.noAvailablePass.title")}
            </CustomText>
            <CustomText
              marginTop={8}
              textAlign="center"
              color={colors.gray7}
              fontSize={16}
            >
              {t("qrScanError.noAvailablePass.description")}
            </CustomText>
          </View>
        );

      default:
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              {t("qrScanError.unknown.title")}
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              {t("qrScanError.unknown.description")}
            </CustomText>
          </View>
        );
    }
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <View style={styles.container}>
        <Image
          source={grayErrorIcon}
          style={{
            width: getResponsiveSize(60),
            height: getResponsiveSize(60),
          }}
        />

        {renderErrorMessage()}

        {router.params.code === "002" ? (
          <View style={styles.buttonArea}>
            <CustomButton
              onPress={handleRouteStoreDetail}
              flex={1}
              height={getResponsiveSize(53)}
              backgroundColor={colors.white}
              borderColor={colors.gray2}
              borderWidth={1}
            >
              <CustomText fontSize={18} fontWeight={"600"}>
                {t("qrScanError.goToPurchase")}
              </CustomText>
            </CustomButton>
          </View>
        ) : (
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
                {t("qrScanError.rescan")}
              </CustomText>
            </CustomButton>
          </View>
        )}
      </View>
    </CustomSafeAreaView>
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
    paddingBottom: getResponsiveSize(100),
  },
  closeButton: {
    position: "absolute",
    top: getResponsiveSize(20),
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
