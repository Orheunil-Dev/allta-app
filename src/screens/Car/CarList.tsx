import { useRef, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CarStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { colors } from "@/styles";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { kebabIcon, plusIcon } from "@/assets/images";
import { useCarControllerGetCarList } from "@/api/car/car";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import { CarOptionsBottomSheet } from "@/components/bottom-sheet";
import { Car } from "@/types";

export const CarList = () => {
  const carStackNavigation =
    useNavigation<NativeStackNavigationProp<CarStackParamList>>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const setErrorModal = useSetAtom(errorModalAtom);

  const [car, setCar] = useState<Car | undefined>(undefined);

  const { data: carData, refetch: carsRefetch } = useCarControllerGetCarList({
    query: {
      queryKey: ["cars"],
      retry: false,
      gcTime: 0,
    },
  });

  // 차량 등록 화면 이동
  const handleRouteCarRegister = () => {
    if (carData?.data.length && carData?.data.length > 4) {
      return setErrorModal({
        visible: true,
        message: "차량은 최대 5대까지 등록 가능합니다.",
      });
    }

    return carStackNavigation.navigate("CarRegister");
  };

  // 차량 수정 화면 이동
  const handleRouteCarUpdate = () => {
    if (!car) return;

    handleCloseBottomSheet();

    return carStackNavigation.navigate("CarUpdate", {
      car,
    });
  };

  const handleOpenBottomSheet = (car: Car) => () => {
    setCar(car);
    bottomSheetRef?.current?.present();
  };
  const handleCloseBottomSheet = () => {
    setCar(undefined);
    bottomSheetRef?.current?.close();
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CarOptionsBottomSheet
        ref={bottomSheetRef}
        id={car?.id}
        isMain={car?.isMain}
        onClose={handleCloseBottomSheet}
        handleRouteCarUpdate={handleRouteCarUpdate}
      />

      <View style={styles.container}>
        <CustomButton
          onPress={handleRouteCarRegister}
          width={"100%"}
          height={getResponsiveSize(64)}
          marginBottom={16}
          backgroundColor={colors.white}
          borderWidth={1}
          borderColor={colors.gray2}
        >
          <Image source={plusIcon} style={styles.plusIcon} />
          <CustomText fontSize={16}>차량 추가하기</CustomText>
        </CustomButton>

        <FlatList
          data={carData?.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: getResponsiveSize(16) }}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.car,
                item.isMain && {
                  borderWidth: 1,
                  borderColor: colors.point2,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: getResponsiveSize(4),
                }}
              >
                <CustomText fontSize={18} fontWeight={"600"}>
                  {item.number}
                </CustomText>

                {item.isMain && (
                  <View style={styles.mainCar}>
                    <CustomText
                      color={colors.point2}
                      fontSize={12}
                      fontWeight={"500"}
                      lineHeight={1.4}
                    >
                      대표차량
                    </CustomText>
                  </View>
                )}
              </View>

              <Pressable
                onPress={handleOpenBottomSheet(item)}
                style={styles.kebabButton}
              >
                <Image
                  source={kebabIcon}
                  style={{
                    width: getResponsiveSize(24),
                    height: getResponsiveSize(24),
                  }}
                />
              </Pressable>

              <View style={{ flexDirection: "row" }}>
                <CustomText color={colors.gray7} fontSize={16}>
                  {item.vendor}
                </CustomText>
                <CustomText marginLeft={6} color={colors.gray7} fontSize={16}>
                  {item.model}
                </CustomText>
              </View>
            </View>
          )}
        />
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(20),
  },
  car: {
    position: "relative",
    padding: getResponsiveSize(16),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  kebabButton: {
    position: "absolute",
    top: getResponsiveSize(16),
    right: getResponsiveSize(16),
  },
  plusIcon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    marginRight: getResponsiveSize(8),
  },
  mainCar: {
    alignItems: "center",
    marginLeft: getResponsiveSize(8),
    paddingVertical: getResponsiveSize(3),
    paddingHorizontal: getResponsiveSize(7),
    borderWidth: 1,
    borderColor: colors.point2,
    borderRadius: 20,
  },
});
