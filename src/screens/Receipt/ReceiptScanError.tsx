import dayjs from "dayjs";
import { closeIcon, completeIcon, grayErrorIcon } from "@/assets/images";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList, PaymentStackParamList } from "@/navigations";
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

type PaymentRouteProp = RouteProp<PaymentStackParamList, "PaymentComplete">;

export const ReceiptScanError = () => {
  const router = useRoute<PaymentRouteProp>();

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
        <CustomText marginTop={20} fontSize={22} fontWeight={"600"}>
          영수증 인식에 실패했습니다.
        </CustomText>

        <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
          이용권 결제가 완료되었습니다.
        </CustomText>

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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
