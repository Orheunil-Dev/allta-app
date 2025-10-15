import dayjs from "dayjs";
import { completeIcon } from "@/assets/images";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList, PaymentStackParamList } from "@/navigations";
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

type PaymentRouteProp = RouteProp<PaymentStackParamList, "PaymentComplete">;

export const PaymentComplete = () => {
  const router = useRoute<PaymentRouteProp>();

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
          결제 완료!
        </CustomText>

        <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
          이용권 결제가 완료되었습니다.
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
              결재 내역 보기
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
              홈 화면 가기
            </CustomText>
          </CustomButton>
        </View>

        <View style={styles.receipt}>
          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              세차 서비스
            </CustomText>
            <CustomText fontSize={16}>
              {formatServiceType(router.params.serviceType)}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              이용권
            </CustomText>
            <CustomText fontSize={16}>
              {formatPassType(router.params.productType)}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              매장
            </CustomText>
            <CustomText fontSize={16}>{router.params.storeName}</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              차량번호
            </CustomText>
            <CustomText fontSize={16}>{router.params.carNumber}</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              결제일시
            </CustomText>
            <CustomText fontSize={16}>
              {dayjs(router.params.approvedAt).format("YYYY.MM.DD HH:mm")}
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              결제금액
            </CustomText>
            <CustomText fontSize={16}>
              {router.params.totalAmount.toLocaleString()}원
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
