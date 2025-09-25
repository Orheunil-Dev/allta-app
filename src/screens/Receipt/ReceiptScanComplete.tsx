import { completeIcon } from "@/assets/images";
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
import { Image, StyleSheet, View } from "react-native";
import dayjs from "dayjs";

type ReceiptRouteProps = RouteProp<
  ReceiptScanStackParamList,
  "ReceiptScanComplete"
>;

export const ReceiptScanComplete = () => {
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
          영수증 인식 완료!
        </CustomText>

        <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
          주유 할인 쿠폰이 발급되었습니다.
        </CustomText>
        <CustomText color={colors.gray7} fontSize={16}>
          마이페이지-쿠폰함에서 확인해주세요.
        </CustomText>

        <View style={styles.buttonArea}>
          <CustomButton
            flex={1}
            height={getResponsiveSize(53)}
            backgroundColor={colors.white}
            borderColor={colors.gray2}
            borderWidth={1}
          >
            <CustomText fontSize={18} fontWeight={"600"}>
              쿠폰함 가기
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
              매장
            </CustomText>
            <CustomText fontSize={16}>{router.params.storeName}</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              할인 금액
            </CustomText>
            <CustomText fontSize={16}>
              {router.params.discountValue.toLocaleString()}원
            </CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              사용기한
            </CustomText>
            <CustomText fontSize={16}>
              {dayjs(router.params.createdAt).format("YYYY.MM.DD")} ~{" "}
              {dayjs(router.params.expiredAt).format("YYYY.MM.DD")}
            </CustomText>
          </View>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
