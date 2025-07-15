import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { CustomButton } from "@/components/ui/CustomButton";
import { getResponsiveSize } from "@/utils";

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
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <CustomText>가입 완료</CustomText>
          </View>
        </ScrollView>

        <CustomButton
          onPress={handleNextStep}
          backgroundColor={colors.black}
          marginBottom={20}
        >
          <CustomText color={colors.white}>완료</CustomText>
        </CustomButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
  },
  scrollView: {
    flexGrow: 1,
  },
  form: {
    alignItems: "center",
  },
});
