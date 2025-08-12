import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { colors } from "@/styles";

type SignUpUserInfoRouteProp = RouteProp<LoginStackParamList, "SignUpTerms">;

export const SignUpTerms = () => {
  const route = useRoute<SignUpUserInfoRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const isValid = true;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <CustomText fontSize={24} fontWeight={"600"}>
              약관에 동의해주세요.
            </CustomText>
          </ScrollView>

          <CustomButton
            onPress={() => {
              return loginStackNavigation.navigate("SignUpUserInfo", {
                ...route.params,
              });
            }}
            isDisabled={!isValid}
            backgroundColor={isValid ? colors.main : colors.gray2}
          >
            <CustomText
              color={isValid ? colors.white : colors.gray5}
              fontSize={16}
              fontWeight={"600"}
            >
              다음
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
