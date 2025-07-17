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

type SignUpRefferalRouteProp = RouteProp<LoginStackParamList, "SignUpRefferal">;

// 유효성 검사
const signUpFormSchema = z.object({
  refferalCode: z.string(),
});

export const SignUpRefferal = () => {
  const route = useRoute<SignUpRefferalRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const [signUpForm, setSignUpForm] = useState({
    refferalCode: "",
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
    loginStackNavigation.navigate("SignUpServey", {
      ...route.params,
      ...signUpForm,
    });
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
              추천인 코드를 입력해주세요.
            </CustomText>

            <CustomText fontSize={16} marginTop={32}>
              추천인 코드
            </CustomText>
            <SignUpTextInput
              value={signUpForm.refferalCode}
              onChangeText={(text) =>
                handleChangeSignUpForm("refferalCode", text)
              }
              maxLength={6}
              placeholder="추천인 코드 6자리를 입력해주세요."
            />
          </ScrollView>

          <Pressable onPress={handleNextStep}>
            <CustomText
              color={colors.gray7}
              fontSize={16}
              fontWeight={"600"}
              textAlign="center"
              marginBottom={20}
            >
              다음에 등록할게요
            </CustomText>
          </Pressable>

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
