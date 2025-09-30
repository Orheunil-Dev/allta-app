import { GetCarListResponse } from "@/api/models";
import { checkedRadioIcon, uncheckedRadioIcon } from "@/assets/images";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { Car } from "@/types";
import { getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  car: Car | null;
  setCar: React.Dispatch<React.SetStateAction<Car | null>>;
  carData: GetCarListResponse | undefined;
  onPressRegister: () => void;
  showRegister?: boolean;
}

export const CarListBottomSheet = ({
  ref,
  car,
  setCar,
  carData,
  onPressRegister,
  showRegister,
}: Props) => {
  // 차량 선택
  const handleSelectCar = (value: Car) => () => {
    setCar(value);

    return ref?.current?.close();
  };

  const handleClose = () => {
    return ref?.current?.close();
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(500)}
      title="차량 선택"
      onClose={handleClose}
      hasCloseButton
    >
      <View style={styles.container}>
        {carData?.data.length ? (
          <FlatList
            data={carData?.data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: getResponsiveSize(16) }}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={handleSelectCar(item)}
                style={[
                  styles.card,
                  item.id === car?.id && {
                    borderWidth: 2,
                    borderColor: colors.point2,
                  },
                ]}
              >
                <Image
                  source={
                    car?.id === item.id ? checkedRadioIcon : uncheckedRadioIcon
                  }
                  style={styles.radioButton}
                />

                <CustomText marginBottom={4} fontSize={18} fontWeight={"600"}>
                  {item.number}
                </CustomText>
                <View style={{ flexDirection: "row" }}>
                  <CustomText color={colors.gray7} fontSize={16}>
                    {item.vendor}
                  </CustomText>
                  <CustomText marginLeft={6} color={colors.gray7} fontSize={16}>
                    {item.model}
                  </CustomText>
                </View>
              </Pressable>
            )}
          />
        ) : (
          <View style={styles.emptyBox}>
            <CustomText
              marginBottom={4}
              color={colors.gray5}
              fontSize={20}
              fontWeight={"600"}
            >
              차량을 등록해주세요
            </CustomText>
          </View>
        )}
      </View>

      {showRegister && (
        <CustomButton
          onPress={onPressRegister}
          width={"100%"}
          height={getResponsiveSize(53)}
          marginTop={20}
          backgroundColor={colors.main}
        >
          <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
            차량 추가하기
          </CustomText>
        </CustomButton>
      )}
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  card: {
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
  radioButton: {
    position: "absolute",
    top: getResponsiveSize(16),
    right: getResponsiveSize(16),
    width: getResponsiveSize(20),
    height: getResponsiveSize(20),
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
