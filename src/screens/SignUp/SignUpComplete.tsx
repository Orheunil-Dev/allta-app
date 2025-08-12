import { Image, SafeAreaView, StyleSheet, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { getResponsiveSize, regexCarNumber } from "@/utils";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { signupCompleteImage } from "@/assets/images";
import { colors } from "@/styles";

export const SignUpComplete = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const handleGoHome = () => {
    containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "BottomTab",
            params: { screen: "HomeStack" },
          },
        ],
      })
    );
  };

  const handleGoRegister = () => {
    containerNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "BottomTab",
            params: { screen: "HomeStack" },
          },
        ],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <Image source={signupCompleteImage} style={styles.image} />

          <CustomText fontSize={24} fontWeight={"600"} marginBottom={8}>
            회원가입이 완료되었어요!
          </CustomText>

          <CustomText
            textAlign="center"
            fontSize={16}
            color={colors.gray7}
            marginBottom={40}
          >
            올타 회원이 되신 것을 환영해요.{"\n"}첫 세차를 위해 차량과 카드를
            먼저 등록해보세요!
          </CustomText>

          <View style={styles.buttonBox}>
            <CustomButton
              onPress={handleGoHome}
              flex={1}
              backgroundColor={colors.white}
              borderColor={colors.gray2}
            >
              <CustomText color={colors.black} fontSize={16} fontWeight={"600"}>
                홈으로 가기
              </CustomText>
            </CustomButton>
            <CustomButton
              onPress={handleGoRegister}
              flex={1}
              backgroundColor={colors.main}
            >
              <CustomText color={colors.white} fontSize={16} fontWeight={"600"}>
                등록하기
              </CustomText>
            </CustomButton>
          </View>
        </View>
      </CustomKeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(10),
  },
  image: {
    width: getResponsiveSize(200),
    height: getResponsiveSize(200),
    marginBottom: getResponsiveSize(20),
  },
  buttonBox: {
    flexDirection: "row",
    gap: getResponsiveSize(16),
  },
});
