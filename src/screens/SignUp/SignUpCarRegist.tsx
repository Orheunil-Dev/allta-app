import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@/navigations";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { CustomButton } from "@/components/ui/CustomButton";
import { getResponsiveSize } from "@/utils";

export const SignUpCarRegist = () => {
  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const handleNextStep = () => {
    loginStackNavigation.navigate("SignUpRefferal");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <CustomText>차량 등록</CustomText>
          </View>
        </ScrollView>

        <CustomButton
          onPress={handleNextStep}
          backgroundColor={colors.black}
          marginBottom={20}
        >
          <CustomText color={colors.white}>다음</CustomText>
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
