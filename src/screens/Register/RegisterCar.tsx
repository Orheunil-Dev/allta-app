import { useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginStackParamList } from "@/navigations";
import { z } from "zod";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getResponsiveSize, regexCarNumber } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { SignUpTextInput } from "@/components/ui/TextInput";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { colors } from "@/styles";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import {
  useCarModelControllerGetCarModels,
  useCarModelControllerGetCarVendors,
} from "@/api/car-model/car-model";

// 유효성 검사
const registerFormSchema = z.object({
  carBrand: z.string(),
  carModel: z.string(),
  carType: z.string(),
  carNumber: z
    .string()
    .regex(regexCarNumber, "올바른 차량번호 형식이 아닙니다."),
});

const carNumberSchema = z
  .string()
  .regex(regexCarNumber, "올바른 차량번호 형식이 아닙니다.");

export const RegisterCar = () => {
  const loginStackNavigation =
    useNavigation<NativeStackNavigationProp<LoginStackParamList>>();

  const brandSelectRef = useRef<BottomSheetModal>(null);
  const modelSelectRef = useRef<BottomSheetModal>(null);

  const [carVendor, setCarVendor] = useState<string | null>(null);
  const [registerForm, setRegisterForm] = useState({
    carBrand: "",
    carModel: "",
    carType: "",
    carNumber: "",
  });

  const {
    data: carVendorsData,
    isPending: carVendorsLoading,
    isError: carVendorsError,
  } = useCarModelControllerGetCarVendors({
    query: {
      gcTime: 0,
    },
  });

  const {
    data: carModelsData,
    isPending: carModelsLoading,
    isError: carModelsError,
  } = useCarModelControllerGetCarModels(carVendor!, {
    query: {
      enabled: !!carVendor,
      gcTime: 0,
    },
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
    if (!registerForm.carBrand) {
      return;
    }
    modelSelectRef?.current?.present();
  };
  const handleCloseModelSelect = () => {
    modelSelectRef?.current?.close();
  };

  const handleChangeRegisterForm = (
    key: keyof typeof registerForm,
    value: string
  ) => {
    setRegisterForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isValid = registerFormSchema.safeParse(registerForm).success;

  const handleSkipRegist = () => {
    loginStackNavigation.navigate("RegisterCard", {});
  };

  const handleNextStep = () => {
    loginStackNavigation.navigate("RegisterCard", {
      ...registerForm,
    });
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        {/* 제조사 바텀시트 */}
        <CustomBottomSheet
          onClose={handleCloseBrandSelect}
          ref={brandSelectRef}
          title="제조사"
        >
          <FlatList
            data={carVendorsData?.data}
            keyExtractor={(item) => item.vendor}
            style={{ width: "100%" }}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  handleChangeRegisterForm("carBrand", item.vendor);
                  setCarVendor(item.vendor);
                  handleCloseBrandSelect();
                }}
                key={index}
                style={styles.list}
              >
                <CustomText
                  color={
                    registerForm.carBrand === item.vendor
                      ? colors.main
                      : colors.black
                  }
                  fontSize={16}
                >
                  {item.vendor}
                </CustomText>
              </Pressable>
            )}
          />
        </CustomBottomSheet>

        {/* 차량모델 바텀시트 */}
        <CustomBottomSheet
          onClose={handleCloseModelSelect}
          ref={modelSelectRef}
          title="모델"
        >
          {carModelsData?.data && (
            <FlatList
              data={carModelsData?.data}
              keyExtractor={(item) => item.name!}
              style={{ width: "100%" }}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => {
                    handleChangeRegisterForm("carModel", item.name!);
                    handleChangeRegisterForm("carType", item.type!);
                    handleCloseModelSelect();
                  }}
                  key={index}
                  style={styles.list}
                >
                  <CustomText
                    color={
                      registerForm.carModel === item.name
                        ? colors.main
                        : colors.black
                    }
                    fontSize={16}
                  >
                    {item.name}
                  </CustomText>
                </Pressable>
              )}
            />
          )}
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
                  value={registerForm.carBrand}
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
                  value={registerForm.carModel}
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
              value={registerForm.carNumber}
              onChangeText={(text) =>
                handleChangeRegisterForm("carNumber", text)
              }
              maxLength={8}
              errorMessage={
                registerForm.carNumber.length > 6
                  ? carNumberSchema.safeParse(registerForm.carNumber).error
                      ?.issues?.[0]?.message
                  : undefined
              }
              placeholder="12가3456"
            />
          </ScrollView>

          <Pressable onPress={handleSkipRegist}>
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
    </CustomSafeAreaView>
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
    paddingBottom: getResponsiveSize(10),
  },
  selectInput: {
    flex: 1,
  },
  list: {
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
});
