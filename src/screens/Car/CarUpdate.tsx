import { useRef, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { z } from "zod";
import {
  useCarControllerGetCarModels,
  useCarControllerGetCarVendors,
  useCarControllerUpdateCar,
} from "@/api/car/car";
import { CarStackParamList } from "@/navigations";
import { errorModalAtom } from "@/jotai";
import { getResponsiveSize, regexCarNumber } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import { Spinner } from "@/components/ui/Spinner";
import { blackDownArrow, grayErrorIcon } from "@/assets/images";
import { colors } from "@/styles";

// 유효성 검사
const registerFormSchema = z.object({
  vendor: z.string(),
  model: z.string(),
  type: z.string(),
  number: z.string().regex(regexCarNumber, "올바른 차량번호 형식이 아닙니다."),
});

const carNumberSchema = z
  .string()
  .regex(regexCarNumber, "올바른 차량번호 형식이 아닙니다.");

type CarUpdateRouteProp = RouteProp<CarStackParamList, "CarUpdate">;

export const CarUpdate = () => {
  const router = useRoute<CarUpdateRouteProp>();

  const carStackNavigation =
    useNavigation<NativeStackNavigationProp<CarStackParamList>>();

  const queryClient = useQueryClient();

  const brandSelectRef = useRef<BottomSheetModal>(null);
  const modelSelectRef = useRef<BottomSheetModal>(null);

  const setErrorModal = useSetAtom(errorModalAtom);

  const [vendor, setVendor] = useState<string | null>(router.params.car.vendor);
  const [updateForm, setUpdateForm] = useState({
    id: router.params.car.id,
    vendor: router.params.car.vendor,
    model: router.params.car.model,
    type: router.params.car.type,
    number: router.params.car.number,
  });

  // 제조사 조회 API
  const {
    data: carVendorsData,
    isPending: carVendorsLoading,
    isError: carVendorsError,
  } = useCarControllerGetCarVendors({
    query: {
      gcTime: 0,
    },
  });

  // 모델명 조회 API
  const {
    data: carModelsData,
    isPending: carModelsLoading,
    isError: carModelsError,
  } = useCarControllerGetCarModels(vendor!, {
    query: {
      enabled: !!vendor,
      gcTime: 0,
    },
  });

  // 차량 수정 API
  const {
    mutate: updateCar,
    isError: updateCarError,
    isPending: updateCarLoading,
  } = useCarControllerUpdateCar({});

  // 제조사 바텀시트 조작
  const handleOpenBrandSelect = () => {
    brandSelectRef?.current?.present();
  };
  const handleCloseBrandSelect = () => {
    brandSelectRef?.current?.close();
  };

  // 모델 바텀시트 조작
  const handleOpenModelSelect = () => {
    if (!updateForm.vendor) return;

    modelSelectRef?.current?.present();
  };
  const handleCloseModelSelect = () => {
    modelSelectRef?.current?.close();
    brandSelectRef?.current?.close();
  };

  const handleChangeUpdateForm = (
    key: keyof typeof updateForm,
    value: string
  ) => {
    setUpdateForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    updateCar(
      { data: { ...updateForm } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cars"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });

          return carStackNavigation.goBack();
        },
        onError: (error: any) => {
          setErrorModal({
            visible: true,
            message: error?.message ?? "차량 삭제 중 오류가 발생했습니다.",
          });
        },
      }
    );
  };

  const isValid = registerFormSchema.safeParse(updateForm).success;

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
          <ScrollView
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            {carVendorsData?.data.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  handleChangeUpdateForm("vendor", item.vendor);
                  handleChangeUpdateForm("type", "");
                  handleChangeUpdateForm("model", "");
                  setVendor(item.vendor);
                  handleCloseBrandSelect();
                }}
                style={styles.list}
              >
                <CustomText
                  color={
                    updateForm.vendor === item.vendor
                      ? colors.main
                      : colors.black
                  }
                  fontSize={16}
                >
                  {item.vendor}
                </CustomText>
              </Pressable>
            ))}
          </ScrollView>
        </CustomBottomSheet>

        {/* 차량모델 바텀시트 */}
        <CustomBottomSheet
          ref={modelSelectRef}
          title="모델"
          hasCloseButton
          onClose={handleCloseModelSelect}
        >
          <ScrollView style={{ width: "100%" }}>
            {carModelsData?.data.map((item, index) => (
              <Pressable
                onPress={() => {
                  handleChangeUpdateForm("model", item.name!);
                  handleChangeUpdateForm("type", item.type!);
                  handleCloseModelSelect();
                }}
                key={index}
                style={styles.list}
              >
                <CustomText
                  color={
                    updateForm.model === item.name ? colors.main : colors.black
                  }
                  fontSize={16}
                >
                  {item.name}
                </CustomText>
              </Pressable>
            ))}
          </ScrollView>
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
                  value={updateForm.vendor}
                  onChangeText={() => {}}
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
                  value={updateForm.model}
                  onChangeText={() => {}}
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
              value={updateForm.number}
              onChangeText={(text) => handleChangeUpdateForm("number", text)}
              maxLength={8}
              errorMessage={
                updateForm.number.length > 6
                  ? carNumberSchema.safeParse(updateForm.number).error
                      ?.issues?.[0]?.message
                  : undefined
              }
              placeholder="예) 12가3456"
              onReset={() => handleChangeUpdateForm("number", "")}
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
            isDisabled={!isValid || updateCarLoading}
            height={getResponsiveSize(53)}
            backgroundColor={isValid ? colors.main : colors.gray2}
          >
            {updateCarLoading ? (
              <Spinner />
            ) : (
              <CustomText
                color={isValid ? colors.white : colors.gray5}
                fontSize={16}
                fontWeight={"600"}
              >
                수정하기
              </CustomText>
            )}
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
    paddingVertical: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(20),
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
