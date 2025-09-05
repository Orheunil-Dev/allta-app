import { completeIcon } from "@/assets/images";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, StyleSheet, View } from "react-native";

export const PaymentComplete = () => {
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
          결제 완료!
        </CustomText>

        <CustomText marginTop={8} color={colors.gray7} fontSize={16}>
          이용권 결제가 완료되었습니다.
        </CustomText>
        <CustomText color={colors.gray7} fontSize={16}>
          서하남 배다리 주유소에 세차를 이용할 수 있어요.
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
            <CustomText fontSize={16}>자동세차</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              이용권
            </CustomText>
            <CustomText fontSize={16}>프리미엄</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              매장
            </CustomText>
            <CustomText fontSize={16}>서하남 배다리 주유소</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              차량번호
            </CustomText>
            <CustomText fontSize={16}>12가3456</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              결제일시
            </CustomText>
            <CustomText fontSize={16}>2025. 07. 25 12:00:24</CustomText>
          </View>

          <View style={styles.row}>
            <CustomText color={colors.gray5} fontSize={16}>
              결제금액
            </CustomText>
            <CustomText fontSize={16}>28,000원</CustomText>
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
