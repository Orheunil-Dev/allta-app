import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@/navigations";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { CustomButton } from "@/components/ui/CustomButton";
import { getResponsiveSize, regexCarNumber } from "@/utils";
import { SignUpTextInput } from "@/components/ui/TextInput";
import { useState } from "react";
import { z } from "zod";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";

type SignUpServeyRouteProp = RouteProp<LoginStackParamList, "SignUpServey">;

// 유효성 검사
const signUpFormSchema = z.object({
  joinPath: z.string(),
});

export const SignUpServey = () => {
  const route = useRoute<SignUpServeyRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const [signUpForm, setSignUpForm] = useState({
    joinPath: "",
  });

  const handleChangeSignUpForm = (
    key: keyof typeof signUpForm,
    value: string
  ) => {
    setSignUpForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isValid = signUpFormSchema.safeParse(signUpForm).success;

  const handleNextStep = () => {
    loginStackNavigation.navigate("SignUpComplete");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            <CustomText fontSize={24} fontWeight={"600"}>
              올타를 어떻게 알게 되셨나요?
            </CustomText>

            <CustomText fontSize={16} marginTop={32}>
              기타
            </CustomText>
            <SignUpTextInput
              value={signUpForm.joinPath}
              onChangeText={(text) => handleChangeSignUpForm("joinPath", text)}
              maxLength={6}
              placeholder="직접 입력"
            />
          </ScrollView>

          <CustomButton
            onPress={handleNextStep}
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
  inputBox: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  sendCodeButton: {
    justifyContent: "center",
    alignSelf: "center",
    width: getResponsiveSize(90),
    height: getResponsiveSize(24),
    marginLeft: getResponsiveSize(12),
    borderWidth: 1,
    borderRadius: 15,
  },
  timer: {
    position: "absolute",
    right: getResponsiveSize(10),
  },
});
