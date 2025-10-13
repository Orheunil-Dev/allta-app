import { blackDownArrow, blackRightArrow } from "@/assets/images";
import { CustomText } from "@/components/ui/CustomText";
import { getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { colors } from "@/styles";
import { CarListBottomSheet } from "@/components/bottom-sheet/CarListBottomSheet";
import { useCarControllerGetCarList } from "@/api/car/car";
import { Car, PassType } from "@/types";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  car: Car | null;
  setCar: React.Dispatch<React.SetStateAction<Car | null>>;
  passType: PassType | null;
  setPassType: React.Dispatch<React.SetStateAction<PassType | null>>;
}

const { width: screenWidth } = Dimensions.get("window");

export const PassFilter = ({ car, setCar, passType, setPassType }: Props) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [scrollEnabled, setScrollEnabled] = useState(false);

  const { data: carData, refetch: carsRefetch } = useCarControllerGetCarList({
    query: {
      queryKey: ["cars"],
      retry: false,
      gcTime: 0,
    },
  });

  // 이용권 종류 필터 변경
  const handleSetPassType = (value: PassType) => () => {
    if (value === passType) {
      return setPassType(null);
    }

    return setPassType(value);
  };

  useEffect(() => {
    if (carData?.data && carData.data.length > 0) {
      const mainCar = carData.data.find((car) => car.isMain);

      if (mainCar) {
        setCar(mainCar);
      } else {
        setCar(carData.data[0]);
      }
    }
  }, [carData?.data]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: getResponsiveSize(8) }}
        onContentSizeChange={(contentWidth) => {
          setScrollEnabled(contentWidth > screenWidth - getResponsiveSize(40));
        }}
      >
        <CarListBottomSheet
          ref={bottomSheetRef}
          car={car}
          setCar={setCar}
          carData={carData}
          onPressRegister={() => {}}
          showRegister={false}
        />

        {/* 차량 번호 필터 */}
        <Pressable
          onPress={() => bottomSheetRef.current?.present()}
          style={styles.carSelectButton}
        >
          <CustomText marginRight={4} fontSize={15} fontWeight={"500"}>
            {car ? car.number : "차량 미등록"}
          </CustomText>
          <Image
            source={blackDownArrow}
            style={{
              width: getResponsiveSize(8),
              height: getResponsiveSize(4),
            }}
          />
        </Pressable>

        {/* 이용권 종류 필터 */}
        <Pressable
          onPress={handleSetPassType("PREMIUM")}
          style={[
            styles.carSelectButton,
            passType === "PREMIUM" && {
              backgroundColor: colors.point2,
              borderWidth: 0,
            },
          ]}
        >
          <CustomText
            marginRight={4}
            color={passType === "PREMIUM" ? colors.white : colors.black}
            fontSize={15}
            fontWeight={"500"}
          >
            프리미엄
          </CustomText>
        </Pressable>

        <Pressable
          onPress={handleSetPassType("STANDARD")}
          style={[
            styles.carSelectButton,
            passType === "STANDARD" && {
              backgroundColor: colors.point2,
              borderWidth: 0,
            },
          ]}
        >
          <CustomText
            marginRight={4}
            color={passType === "STANDARD" ? colors.white : colors.black}
            fontSize={15}
            fontWeight={"500"}
          >
            스탠다드
          </CustomText>
        </Pressable>

        <Pressable
          onPress={handleSetPassType("TICKET")}
          style={[
            styles.carSelectButton,
            passType === "TICKET" && {
              backgroundColor: colors.point2,
              borderWidth: 0,
            },
          ]}
        >
          <CustomText
            marginRight={4}
            color={passType === "TICKET" ? colors.white : colors.black}
            fontSize={15}
            fontWeight={"500"}
          >
            일회권
          </CustomText>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(20),
    gap: getResponsiveSize(8),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  carSelectButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: getResponsiveSize(6),
    paddingHorizontal: getResponsiveSize(14),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
  },
});
