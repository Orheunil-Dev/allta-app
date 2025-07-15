import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { LoginStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { getFontSize, getResponsiveSize } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";

export const Login = () => {
  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const handleSocialLogin = () => {
    loginStackNavigation.navigate("SignUpUserInfo");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.title}>
            <CustomText
              color={colors.black}
              fontSize={getFontSize(28)}
              fontWeight={"700"}
              textAlign="center"
            >
              월구독으로
              {"\n"}내 맘대로, 간편 세차
            </CustomText>
          </View>

          <View style={styles.image}>
            <CustomText>이미지 들어갈 자리</CustomText>
          </View>
        </View>

        <View style={styles.bottom}>
          {/* 카카오 로그인 */}
          <CustomButton onPress={handleSocialLogin} backgroundColor="#FEE500">
            <CustomText fontSize={15} fontWeight={"500"}>
              카카오로 로그인
            </CustomText>
          </CustomButton>

          {/* 구글 로그인 */}
          <CustomButton
            marginTop={getResponsiveSize(12)}
            backgroundColor={colors.white}
            borderColor={colors.gray7}
          >
            <CustomText fontSize={15} fontWeight={"500"}>
              구글 계정으로 로그인
            </CustomText>
          </CustomButton>

          {/* 애플 로그인 */}
          {Platform.OS === "ios" && (
            <CustomButton
              marginTop={getResponsiveSize(12)}
              backgroundColor="#141414"
            >
              <CustomText color={colors.white} fontSize={15} fontWeight={"500"}>
                Apple로 로그인
              </CustomText>
            </CustomButton>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(40),
    backgroundColor: colors.white,
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
    width: getResponsiveSize(280),
    height: getResponsiveSize(280),
    backgroundColor: colors.main,
  },
  top: { position: "relative", alignItems: "center", width: "100%" },
  title: {
    position: "absolute",
    top: -getResponsiveSize(100),
  },
  bottom: {
    position: "absolute",
    width: "100%",
    bottom: getResponsiveSize(20),
  },
});
