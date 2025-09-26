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

type ReceiptRouteProps = RouteProp<
  ReceiptScanStackParamList,
  "ReceiptScanError"
>;

export const ReceiptScanError = () => {
  const router = useRoute<ReceiptRouteProps>();

  const navigation = useNavigation();

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

  const renderErrorMessage = () => {
    switch (router.params.code) {
      case "001":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              영수증 인식에 실패했습니다.
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              깨끗한한 배경에 영수증을 놓고
            </CustomText>
            <CustomText color={colors.gray7} fontSize={16}>
              전체가 잘 나오도록 촬영해 주세요.
            </CustomText>
          </View>
        );

      case "002":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              이미 등록된 영수증입니다.
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              해당 영수증은 이미 쿠폰이 발급되었습니다.
            </CustomText>
            <CustomText color={colors.gray7} fontSize={16}>
              영수증 당 1회만 쿠폰이 발급됩니다.
            </CustomText>
          </View>
        );

      case "003":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              올타 제휴 매장이 아닙니다.
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              영수증 할인은 제휴 매장에서만 적용 가능합니다.
            </CustomText>
          </View>
        );

      case "004":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              주유 할인 대상 매장이 아닙니다.
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              해당 매장은 주유 할인 혜택을 제공하지 않습니다.
            </CustomText>
          </View>
        );

      case "005":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              주유 금액이 부족합니다.
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              주유 금액이 최소 {router.params.message}원 이상일 경우에만
            </CustomText>
            <CustomText color={colors.gray7} fontSize={16}>
              할인 쿠폰이 발급됩니다.
            </CustomText>
          </View>
        );

      case "006":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              주유 할인 대상 매장이 아닙니다.
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              해당 매장은 주유 할인 혜택을 제공하지 않습니다.
            </CustomText>
          </View>
        );

      case "007":
        return (
          <View style={styles.errorMessage}>
            <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
              영수증 유효기간이 지났습니다.
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
              영수증 인식에 실패했습니다.
            </CustomText>

            <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
              깨끗한한 배경에 영수증을 놓고
            </CustomText>
            <CustomText color={colors.gray7} fontSize={16}>
              전체가 잘 나오도록 촬영해 주세요.
            </CustomText>
          </View>
        );
    }
  };

  return (
    <CustomSafeAreaView edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Pressable onPress={handleRouteHome} style={styles.closeButton}>
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
              다시 촬영하기
            </CustomText>
          </CustomButton>
        </View>
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
