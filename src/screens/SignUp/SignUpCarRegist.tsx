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
import { useRef, useState } from "react";
import { z } from "zod";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CreateUserDtoCarType } from "@/api/models/createUserDtoCarType";

type SignUpCarRegistRouteProp = RouteProp<
  LoginStackParamList,
  "SignUpCarRegist"
>;

// 유효성 검사
const signUpFormSchema = z.object({
  carBrand: z.string(),
  carModel: z.string(),
  carType: z.enum(["SEDAN", "SUV", "VAN"]),
  carNumber: z
    .string()
    .regex(regexCarNumber, "올바른 차량번호 형식이 아닙니다."),
});

export const SignUpCarRegist = () => {
  const route = useRoute<SignUpCarRegistRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const [signUpForm, setSignUpForm] = useState({
    carBrand: "",
    carModel: "",
    carType: null,
    carNumber: "",
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
    loginStackNavigation.navigate("SignUpRefferal", {
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
              대표 차량을 등록해주세요.
            </CustomText>

            <CustomText fontSize={16} marginTop={32}>
              제조사
            </CustomText>
            <SignUpTextInput
              value={signUpForm.carBrand}
              onChangeText={(text) => handleChangeSignUpForm("carBrand", text)}
              placeholder="선택"
            />

            <CustomText fontSize={16} marginTop={32}>
              모델
            </CustomText>
            <SignUpTextInput
              value={signUpForm.carBrand}
              onChangeText={(text) => handleChangeSignUpForm("carBrand", text)}
              placeholder="선택"
            />

            <CustomText fontSize={16} marginTop={32}>
              차량번호
            </CustomText>
            <SignUpTextInput
              value={signUpForm.carBrand}
              onChangeText={(text) => handleChangeSignUpForm("carBrand", text)}
              placeholder="12가3456"
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
