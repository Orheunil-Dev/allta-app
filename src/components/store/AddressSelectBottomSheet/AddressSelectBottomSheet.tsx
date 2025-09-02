import { Image, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomButton } from "@/components/ui/CustomButton";
import { myLocationIcon } from "@/assets/images";
import { colors } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AddressStackParamList, ContainerStackParamList } from "@/navigations";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  onClose: () => void;
  setCoordinate: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
}

export const AddressSelectBottomSheet = ({
  ref,
  onClose,
  setCoordinate,
}: Props) => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const setCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return onClose();
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setCoordinate({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
    });

    return onClose();
  };

  const handleRegisterAddress = () => {
    return containerNavigation.navigate("AddressStack", {
      screen: "SearchAddress",
    });
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(520)}
      title="주소 선택"
      onClose={onClose}
    >
      <View style={styles.container}>
        <CustomButton
          onPress={setCurrentLocation}
          width={"100%"}
          marginTop={12}
          borderColor={colors.gray2}
        >
          <Image source={myLocationIcon} style={styles.locationIcon} />
          <CustomText fontSize={15} fontWeight={"500"}>
            현재 위치로 설정
          </CustomText>
        </CustomButton>
      </View>

      <CustomButton
        onPress={handleRegisterAddress}
        width={"100%"}
        height={getResponsiveSize(54)}
        backgroundColor={colors.main}
      >
        <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
          주소 추가하기
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
  locationIcon: {
    width: getResponsiveSize(20),
    height: getResponsiveSize(20),
    marginRight: getResponsiveSize(4),
  },
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(30),
  },
});
