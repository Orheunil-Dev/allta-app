import {
  FlatList,
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
import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CreateUserDtoCarType } from "@/api/models/createUserDtoCarType";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomHeader } from "@/components/common/layout/CustomHeader";
import { carData } from "@/mock";

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
const carNumberSchema = z
  .string()
  .regex(regexCarNumber, "올바른 차량번호 형식이 아닙니다.");

export const SignUpCarRegist = () => {
  const route = useRoute<SignUpCarRegistRouteProp>();

  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const brandSelectRef = useRef<BottomSheetModal>(null);
  const modelSelectRef = useRef<BottomSheetModal>(null);

  const [signUpForm, setSignUpForm] = useState({
    carBrand: "",
    carModel: "",
    carType: CreateUserDtoCarType.SEDAN,
    carNumber: "",
  });

  // 제조사 바텀시트 조작
  const handleOpenBrandSelect = () => {
    brandSelectRef?.current?.present();
  };
  const handleCloseBrandSelect = () => {
    brandSelectRef?.current?.close();
  };

  // 모델 바텀시트 조작
  const handleOpenModelSelect = () => {
    // 제조사 선택 안했을 경우엔 바텀시트 안열림
    if (!signUpForm.carBrand) {
      return;
    }

    modelSelectRef?.current?.present();
  };
  const handleCloseModelSelect = () => {
    modelSelectRef?.current?.close();
  };

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
    loginStackNavigation.navigate("SignUpReferral", {
      ...route.params,
      ...signUpForm,
    });
  };

  return (
    <BottomSheetModalProvider>
      <CustomHeader showBackButton={true} />

      <SafeAreaView style={styles.safeArea}>
        <CustomKeyboardAvoidingView>
          {/* 제조사 바텀시트 */}
          <CustomBottomSheet bottomSheetRef={brandSelectRef} title="제조사">
            <FlatList
              data={carData}
              keyExtractor={(item) => item.carBrand}
              style={{ width: "100%" }}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    handleChangeSignUpForm("carBrand", item.carBrand);
                    handleCloseBrandSelect();
                  }}
                  key={index}
                  style={styles.list}
                >
                  <CustomText
                    color={
                      signUpForm.carBrand === item.carBrand
                        ? colors.main
                        : colors.black
                    }
                    fontSize={16}
                  >
                    {item.carBrand}
                  </CustomText>
                </Pressable>
              )}
            />
          </CustomBottomSheet>

          {/* 차량모델 바텀시트 */}
          <CustomBottomSheet bottomSheetRef={modelSelectRef} title="모델">
            <FlatList
              data={
                carData.find((item) => item.carBrand === signUpForm.carBrand)
                  ?.carModels ?? []
              }
              keyExtractor={(item) => item}
              style={{ width: "100%" }}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    handleChangeSignUpForm("carModel", item);
                    handleCloseModelSelect();
                  }}
                  key={index}
                  style={styles.list}
                >
                  <CustomText
                    color={
                      signUpForm.carModel === item ? colors.main : colors.black
                    }
                    fontSize={16}
                  >
                    {item}
                  </CustomText>
                </Pressable>
              )}
            />
          </CustomBottomSheet>

          <View style={styles.container}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            >
              <CustomText fontSize={24} fontWeight={"600"}>
                대표 차량을 등록해주세요.
              </CustomText>

              {/* 제조사 선택 */}
              <CustomText fontSize={16} marginTop={32}>
                제조사
              </CustomText>
              <Pressable
                style={styles.selectInput}
                onPress={handleOpenBrandSelect}
              >
                <View pointerEvents="none">
                  <SignUpTextInput
                    value={signUpForm.carBrand}
                    onChangeText={() => {}}
                    editable={false}
                    placeholder="선택"
                  />
                </View>
              </Pressable>

              {/* 차량모델 선택 */}
              <CustomText fontSize={16} marginTop={32}>
                모델
              </CustomText>
              <Pressable
                style={styles.selectInput}
                onPress={handleOpenModelSelect}
              >
                <View pointerEvents="none">
                  <SignUpTextInput
                    value={signUpForm.carModel}
                    onChangeText={() => {}}
                    editable={false}
                    placeholder="선택"
                  />
                </View>
              </Pressable>

              {/* 차량번호 입력 */}
              <CustomText fontSize={16} marginTop={32}>
                차량번호
              </CustomText>
              <SignUpTextInput
                value={signUpForm.carNumber}
                onChangeText={(text) =>
                  handleChangeSignUpForm("carNumber", text)
                }
                maxLength={8}
                errorMessage={
                  signUpForm.carNumber.length > 6
                    ? carNumberSchema.safeParse(signUpForm.carNumber).error
                        ?.issues?.[0]?.message
                    : undefined
                }
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
    </BottomSheetModalProvider>
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
  selectInput: {
    flex: 1,
  },
  list: {
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
});
