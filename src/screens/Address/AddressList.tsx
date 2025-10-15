import { useRef, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSetAtom } from "jotai";
import { useAddressControllerGetAddressList } from "@/api/address/address";
import { errorModalAtom } from "@/jotai";
import { AddressStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { kebabIcon, plusIcon } from "@/assets/images";
import { colors } from "@/styles";
import { AddressOptionsBottomSheet } from "@/components/bottom-sheet";
import { Address } from "@/types";

export const AddressList = () => {
  const addressStackNavigation =
    useNavigation<NativeStackNavigationProp<AddressStackParamList>>();

  const setErrorModal = useSetAtom(errorModalAtom);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [address, setAddress] = useState<Address | undefined>(undefined);

  // 주소 목록 조회 API
  const { data: addressesData, refetch: addressesRefetch } =
    useAddressControllerGetAddressList({
      query: {
        queryKey: ["addresses"],
        retry: false,
        gcTime: 0,
      },
    });

  // 주소 등록
  const handleRouteAddressRegister = () => {
    if (addressesData?.data.length && addressesData?.data.length > 19) {
      return setErrorModal({
        visible: true,
        message: "주소는 최대 20개까지 등록 가능합니다.",
      });
    }

    return addressStackNavigation.navigate("SearchAddress");
  };

  const handleOpenBottomSheet = (address: Address) => () => {
    setAddress(address);
    bottomSheetRef?.current?.present();
  };
  const handleCloseBottomSheet = () => {
    setAddress(undefined);
    bottomSheetRef?.current?.close();
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <AddressOptionsBottomSheet
        ref={bottomSheetRef}
        id={address?.id}
        onClose={handleCloseBottomSheet}
      />

      <View style={styles.container}>
        <CustomButton
          onPress={handleRouteAddressRegister}
          width={"100%"}
          height={getResponsiveSize(64)}
          marginBottom={16}
          backgroundColor={colors.white}
          borderWidth={1}
          borderColor={colors.gray2}
        >
          <Image source={plusIcon} style={styles.plusIcon} />
          <CustomText fontSize={16}>주소 추가하기</CustomText>
        </CustomButton>

        <FlatList
          data={addressesData?.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: getResponsiveSize(16) }}
          renderItem={({ item, index }) => (
            <View style={[styles.address]}>
              <CustomText marginBottom={4} fontSize={18} fontWeight={"600"}>
                {item.nickname}
              </CustomText>

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

              <CustomText color={colors.gray7} fontSize={16}>
                {item.fullAddress}
              </CustomText>
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
  address: {
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
