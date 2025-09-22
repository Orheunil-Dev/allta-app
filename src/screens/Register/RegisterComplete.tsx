import { Image, StyleSheet, View } from "react-native";
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList, LoginStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { completeIcon } from "@/assets/images";
import { colors } from "@/styles";

type RegisterCompleteRouteProp = RouteProp<
  LoginStackParamList,
  "RegisterComplete"
>;

export const RegisterComplete = () => {
  const route = useRoute<RegisterCompleteRouteProp>();

  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const handleGoHome = () => {
    containerNavigation.dispatch(
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
        <Image source={completeIcon} style={styles.image} />

        <CustomText fontSize={22} fontWeight={"600"} marginBottom={8}>
          {route.params.isRegister
            ? "추가 정보 등록이 완료되었습니다."
            : "필요할 때 등록할 수 있어요."}
        </CustomText>

        {route.params.isRegister ? (
          <CustomText
            textAlign="center"
            fontSize={16}
            color={colors.gray7}
            marginBottom={40}
          >
            차량, 카드 정보는 언제든지 수정할 수 있어요.
          </CustomText>
        ) : (
          <>
            <CustomText textAlign="center" fontSize={16} color={colors.gray7}>
              차량과 카드는 마이페이지에서
            </CustomText>
            <CustomText
              textAlign="center"
              fontSize={16}
              color={colors.gray7}
              marginBottom={40}
            >
              언제든 등록할 수 있어요.
            </CustomText>
          </>
        )}

        <View style={styles.buttonBox}>
          <CustomButton
            onPress={handleGoHome}
            flex={1}
            height={getResponsiveSize(53)}
            backgroundColor={colors.white}
            borderWidth={1}
            borderColor={colors.gray2}
          >
            <CustomText color={colors.black} fontSize={16} fontWeight={"600"}>
              홈으로 가기
            </CustomText>
          </CustomButton>
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
    height: "100%",
    paddingHorizontal: getResponsiveSize(20),
  },
  image: {
    width: getResponsiveSize(60),
    height: getResponsiveSize(60),
    marginBottom: getResponsiveSize(20),
  },
  buttonBox: {
    flexDirection: "row",
    gap: getResponsiveSize(16),
  },
});
