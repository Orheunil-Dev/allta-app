import { Image, Pressable, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomButton } from "@/components/ui/CustomButton";
import {
  checkedCircleIcon,
  myLocationIcon,
  uncheckedCircleIcon,
} from "@/assets/images";
import { colors } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import { useAddressControllerGetAddresses } from "@/api/address/address";
import { useEffect, useState } from "react";
import { GetAddressesResponse } from "@/api/models";
import { FlatList } from "react-native-gesture-handler";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  onClose: () => void;
  coordinate: {
    id: string | null;
    nickname: string | null;
    lat: number;
    lng: number;
  };
  setCoordinate: React.Dispatch<
    React.SetStateAction<{
      id: string | null;
      nickname: string | null;
      lat: number;
      lng: number;
    }>
  >;
}

export const AddressSelectBottomSheet = ({
  ref,
  onClose,
  coordinate,
  setCoordinate,
}: Props) => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const [skip, setSkip] = useState<number>(0);
  const [addresses, setAddresses] = useState<GetAddressesResponse["data"]>([]);

  const { data: addressesData, refetch: addressesRefetch } =
    useAddressControllerGetAddresses(
      {
        take: 20,
        skip,
      },
      {
        query: {
          queryKey: ["addresses"],
          retry: false,
          gcTime: 0,
        },
      }
    );

  const handleLoadMore = () => {
    if (addressesData?.meta?.hasNextPage) {
      setSkip(skip + 20);
    }
  };

  // 현재 위치로 설정
  const setCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return onClose();
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    setCoordinate({
      id: null,
      nickname: null,
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
    });

    return onClose();
  };

  // 주소 등록 화면으로 이동
  const handleRegisterAddress = () => {
    return containerNavigation.navigate("AddressStack", {
      screen: "SearchAddress",
    });
  };

  // 무한 스크롤
  useEffect(() => {
    if (!addressesData?.data) return;

    setAddresses((prev) => {
      if (skip === 0) {
        return addressesData.data;
      }

      return [...prev, ...addressesData.data];
    });
  }, [addressesData]);

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
          borderWidth={1}
        >
          <Image source={myLocationIcon} style={styles.locationIcon} />
          <CustomText fontSize={15} fontWeight={"500"}>
            현재 위치로 설정
          </CustomText>
        </CustomButton>

        {addresses.length > 0 && (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.7}
            contentContainerStyle={{ gap: getResponsiveSize(16) }}
            style={{ marginVertical: getResponsiveSize(16) }}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  setCoordinate({
                    id: item.id,
                    lat: item.lat,
                    lng: item.lng,
                    nickname: item.nickname,
                  });

                  onClose();
                }}
                style={styles.card}
              >
                <Image
                  source={
                    coordinate.id === item.id
                      ? checkedCircleIcon
                      : uncheckedCircleIcon
                  }
                  style={styles.radioButton}
                />

                <CustomText fontSize={18} fontWeight={"600"}>
                  {item.nickname}
                </CustomText>

                <CustomText marginTop={6} color={colors.gray7} fontSize={16}>
                  {item.fullAddress}
                </CustomText>
              </Pressable>
            )}
          />
        )}
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
  buttonBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(30),
  },
});
