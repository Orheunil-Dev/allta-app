import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { CustomButton } from "@/components/ui/CustomButton";
import { getResponsiveSize, regexCarNumber } from "@/utils";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";

export const SignUpComplete = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const handleNextStep = () => {
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <CustomText fontSize={24} fontWeight={"600"} marginBottom={32}>
              회원가입이 완료되었어요!
            </CustomText>
          </ScrollView>

          <CustomButton onPress={handleNextStep} backgroundColor={colors.main}>
            <CustomText color={colors.white} fontSize={16} fontWeight={"600"}>
              시작하기
            </CustomText>
          </CustomButton>
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
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(10),
  },
});
