import { useRef, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CarStackParamList } from "@/navigations";
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
import { blackDownArrow, grayErrorIcon } from "@/assets/images";
import {
  useCarControllerGetCarModels,
  useCarControllerGetCarVendors,
  useCarControllerRegisterCar,
} from "@/api/car/car";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import { useQueryClient } from "@tanstack/react-query";

// 유효성 검사
const registerFormSchema = z.object({
  carVendor: z.string(),
  carModel: z.string(),
  carType: z.string(),
  carNumber: z
    .string()
    .regex(regexCarNumber, "올바른 차량번호 형식이 아닙니다."),
});

const carNumberSchema = z
  .string()
  .regex(regexCarNumber, "올바른 차량번호 형식이 아닙니다.");

export const CarRegister = () => {
  const carStackNavigation =
    useNavigation<NativeStackNavigationProp<CarStackParamList>>();

  const queryClient = useQueryClient();

  const brandSelectRef = useRef<BottomSheetModal>(null);
  const modelSelectRef = useRef<BottomSheetModal>(null);

  const [carVendor, setCarVendor] = useState<string | null>(null);
  const [registerForm, setRegisterForm] = useState({
    carVendor: "",
    carModel: "",
    carType: "",
    carNumber: "",
  });

  // 제조사 조회
  const {
    data: carVendorsData,
    isPending: carVendorsLoading,
    isError: carVendorsError,
  } = useCarControllerGetCarVendors({
    query: {
      gcTime: 0,
    },
  });

  // 모델명 조회
  const {
    data: carModelsData,
    isPending: carModelsLoading,
    isError: carModelsError,
  } = useCarControllerGetCarModels(carVendor!, {
    query: {
      enabled: !!carVendor,
      gcTime: 0,
    },
  });

  // 차량 등록
  const {
    mutate: registerCar,
    isError: registerCarError,
    isPending: regiserCarLoading,
  } = useCarControllerRegisterCar({});

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
    if (!registerForm.carVendor) {
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

  const handleSubmit = () => {
    registerCar(
      { data: { ...registerForm } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cars"] });

          return carStackNavigation.goBack();
        },
      }
    );
  };

  const isValid = registerFormSchema.safeParse(registerForm).success;

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        {/* 제조사 바텀시트 */}
        <CustomBottomSheet
          ref={brandSelectRef}
          title="제조사"
          hasCloseButton
          onClose={handleCloseBrandSelect}
        >
          <FlatList
            data={carVendorsData?.data}
            style={{ width: "100%" }}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  handleChangeRegisterForm("carVendor", item.vendor);
                  setCarVendor(item.vendor);
                  handleCloseBrandSelect();
                }}
                key={index}
                style={styles.list}
              >
                <CustomText
                  color={
                    registerForm.carVendor === item.vendor
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
          ref={modelSelectRef}
          title="모델"
          hasCloseButton
          onClose={handleCloseModelSelect}
        >
          {carModelsData?.data && (
            <FlatList
              data={carModelsData?.data}
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
            {/* 제조사 선택 */}
            <CustomText fontSize={16} fontWeight={"500"}>
              제조사
            </CustomText>
            <Pressable
              style={styles.selectInput}
              onPress={handleOpenBrandSelect}
            >
              <View pointerEvents="none">
                <CustomTextInput
                  value={registerForm.carVendor}
                  onChangeText={() => {}}
                  editable={false}
                  placeholder="선택"
                />
              </View>

              <Image source={blackDownArrow} style={styles.arrow} />
            </Pressable>

            {/* 차량모델 선택 */}
            <CustomText marginTop={32} fontSize={16} fontWeight={"500"}>
              모델
            </CustomText>
            <Pressable
              style={styles.selectInput}
              onPress={handleOpenModelSelect}
            >
              <View pointerEvents="none">
                <CustomTextInput
                  value={registerForm.carModel}
                  onChangeText={() => {}}
                  editable={false}
                  placeholder="선택"
                />
              </View>

              <Image source={blackDownArrow} style={styles.arrow} />
            </Pressable>

            {/* 차량번호 입력 */}
            <CustomText marginTop={32} fontSize={16} fontWeight={"500"}>
              차량번호
            </CustomText>
            <CustomTextInput
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
              onReset={() => handleChangeRegisterForm("carNumber", "")}
            />

            <View style={styles.inquiry}>
              <Image
                source={grayErrorIcon}
                style={{
                  width: getResponsiveSize(20),
                  height: getResponsiveSize(20),
                }}
              />

              <View style={{ flex: 1, marginLeft: getResponsiveSize(8) }}>
                <CustomText color={colors.gray5} fontSize={14}>
                  찾으시는 차량 모델이 목록에 없는 경우, 고객센터로 문의해
                  주세요.
                </CustomText>
              </View>
            </View>
          </ScrollView>

          <CustomButton
            onPress={handleSubmit}
            isDisabled={!isValid}
            height={getResponsiveSize(53)}
            backgroundColor={isValid ? colors.main : colors.gray2}
          >
            <CustomText
              color={isValid ? colors.white : colors.gray5}
              fontSize={16}
              fontWeight={"600"}
            >
              등록하기
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
    position: "relative",
    justifyContent: "center",
    flex: 1,
  },
  arrow: {
    position: "absolute",
    width: getResponsiveSize(10),
    height: getResponsiveSize(5),
    right: getResponsiveSize(10),
  },
  list: {
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
  inquiry: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginTop: getResponsiveSize(32),
    paddingVertical: getResponsiveSize(16),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.gray1,
    borderRadius: 12,
  },
});
