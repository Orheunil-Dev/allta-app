import { blackRightArrow } from "@/assets/images";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "@/styles";
import { CarListBottomSheet } from "@/components/bottom-sheet/CarListBottomSheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import { useCarControllerGetCarList } from "@/api/car/car";
import { Car } from "@/types";

interface Props {
  car: Car | null;
  setCar: React.Dispatch<React.SetStateAction<Car | null>>;
  showRegister?: boolean;
}

export const CarSelectButton = ({ car, setCar, showRegister }: Props) => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { data: carData, refetch: carsRefetch } = useCarControllerGetCarList({
    query: {
      queryKey: ["cars"],
      retry: false,
      gcTime: 0,
    },
  });

  // 카드등록
  const handleRouteCardRegister = () => {
    bottomSheetRef.current?.close();

    return containerNavigation.navigate("CarStack", {
      screen: "CarRegister",
    });
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
    <View>
      <CarListBottomSheet
        ref={bottomSheetRef}
        car={car}
        setCar={setCar}
        carData={carData}
        onPressRegister={handleRouteCardRegister}
        showRegister={showRegister}
      />

      <CustomButton
        onPress={() => bottomSheetRef.current?.present()}
        height={getResponsiveSize(48)}
        borderWidth={1}
        borderColor={colors.line}
      >
        <View style={styles.button}>
          <CustomText fontSize={15} fontWeight={"500"}>
            {car ? car.number : "차량을 등록해주세요"}
          </CustomText>
          <Image
            source={blackRightArrow}
            style={{
              width: getResponsiveSize(24),
              height: getResponsiveSize(24),
            }}
          />
        </View>
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: getResponsiveSize(8),
    paddingLeft: getResponsiveSize(12),
  },
});
