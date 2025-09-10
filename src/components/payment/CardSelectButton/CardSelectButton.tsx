import { useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CustomButton } from "@/components/ui/CustomButton";
import { getResponsiveSize } from "@/utils";
import { colors } from "@/styles";
import { CustomText } from "@/components/ui/CustomText";
import { blackRightArrow } from "@/assets/images";
import { CardListBottomSheet } from "@/components/bottom-sheet/CardListBottomSheet";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";

export const CardSelectButton = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const cardListBottomSheetRef = useRef<BottomSheetModal>(null);

  // 카드 등록
  const handleRouteCardRegister = () => {
    cardListBottomSheetRef.current?.close();

    // return containerNavigation.navigate("CarStack", {
    //   screen: "CarRegister",
    // });
  };

  return (
    <View style={{ marginTop: getResponsiveSize(40) }}>
      <CardListBottomSheet
        ref={cardListBottomSheetRef}
        onPressRegister={handleRouteCardRegister}
      />

      <CustomText fontSize={18} fontWeight={"600"}>
        결제 수단
      </CustomText>

      <CustomButton
        onPress={() => cardListBottomSheetRef.current?.present()}
        height={getResponsiveSize(48)}
        marginTop={12}
        borderWidth={1}
        borderColor={colors.line}
      >
        <View style={styles.button}>
          <CustomText fontSize={15} fontWeight={"500"}>
            카드를 등록해주세요
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
