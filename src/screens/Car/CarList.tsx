import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

export const CarList = () => {
  const carStackNavigation =
    useNavigation<NativeStackNavigationProp<CarStackParamList>>();

  const setErrorModal = useSetAtom(errorModalAtom);

  const { data: carData, refetch: carsRefetch } = useCarControllerGetCarList({
    query: {
      queryKey: ["cars"],
      retry: false,
      gcTime: 0,
    },
  });

  // 차량 등록
  const handleRouteCarRegister = () => {
    if (carData?.data.length && carData?.data.length > 4) {
      return setErrorModal({
        visible: true,
        message: "차량은 최대 5대까지 등록 가능합니다.",
      });
    }

    return carStackNavigation.navigate("CarRegister");
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
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
                  borderWidth: 2,
                  borderColor: colors.point2,
                },
              ]}
            >
              <CustomText marginBottom={4} fontSize={18} fontWeight={"600"}>
                {item.number}
              </CustomText>

              <Pressable style={styles.kebabButton}>
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
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(20),
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
});
