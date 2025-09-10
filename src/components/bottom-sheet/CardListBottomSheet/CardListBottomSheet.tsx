import { useCarControllerGetCarList } from "@/api/car/car";
import { uncheckedRadioIcon } from "@/assets/images";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  onPressRegister: () => void;
}

const { width: screenWidth } = Dimensions.get("window");

export const CardListBottomSheet = ({ ref, onPressRegister }: Props) => {
  const { data: carsData, refetch: carsRefetch } = useCarControllerGetCarList({
    query: {
      queryKey: ["cars"],
      retry: false,
      gcTime: 0,
    },
  });

  const handleClose = () => {
    return ref?.current?.close();
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(500)}
      title="카드 선택"
      onClose={handleClose}
      hasCloseButton
    >
      <View style={styles.container}>
        {carsData?.data.length ? (
          <FlatList
            data={carsData?.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <Pressable onPress={() => {}} style={styles.card}>
                <Image source={uncheckedRadioIcon} style={styles.radioButton} />

                <CustomText marginBottom={4} fontSize={18} fontWeight={"600"}>
                  {item.carNumber}
                </CustomText>
                <View style={{ flexDirection: "row" }}>
                  <CustomText color={colors.gray7} fontSize={16}>
                    {item.carBrand}
                  </CustomText>
                  <CustomText marginLeft={6} color={colors.gray7} fontSize={16}>
                    {item.carModel}
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
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
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
