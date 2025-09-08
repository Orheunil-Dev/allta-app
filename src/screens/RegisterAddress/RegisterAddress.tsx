import { useCallback, useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAddressControllerRegisterAddresses } from "@/api/address/address";
import { RegisterAddresssRequest } from "@/api/models";
import { AddressStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { KakaoMap } from "@/components/store/KakaoMap";
import { colors } from "@/styles";

type RegisterAddressRouteProp = RouteProp<
  AddressStackParamList,
  "RegisterAddress"
>;

const { width: screenWidth } = Dimensions.get("window");

export const RegisterAddress = () => {
  const route = useRoute<RegisterAddressRouteProp>();

  const addressNavigation =
    useNavigation<NativeStackNavigationProp<AddressStackParamList>>();

  const queryClient = useQueryClient();

  const [addressForm, setAddressForm] = useState<RegisterAddresssRequest>({
    nickname: "",
    buildingName: null,
    fullAddress: "",
    lat: route.params.lat,
    lng: route.params.lng,
    region1DepthName: "",
    region2DepthName: "",
    region3DepthName: "",
    roadName: null,
  });
  const [nicknameType, setNicknameType] = useState<"HOME" | "COMPANY" | "ETC">(
    "ETC"
  );

  const {
    mutate: registerAddress,
    isError: registerAddressError,
    isPending: regiserAddressLoading,
  } = useAddressControllerRegisterAddresses({});

  const handleSubmit = () => {
    registerAddress(
      { data: { ...addressForm } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["addresses"] });

          addressNavigation.goBack();
          setTimeout(() => {
            addressNavigation.goBack();
          }, 0);
        },
      }
    );
  };

  useEffect(() => {
    switch (nicknameType) {
      case "HOME":
        return setAddressForm((prev) => ({
          ...prev,
          nickname: "집",
        }));

      case "COMPANY":
        return setAddressForm((prev) => ({
          ...prev,
          nickname: "회사",
        }));

      case "ETC":
        return setAddressForm((prev) => ({
          ...prev,
          nickname: addressForm.buildingName ?? "",
        }));
    }
  }, [nicknameType]);

  useFocusEffect(
    useCallback(() => {
      const getAddresses = async () => {
        const response = await axios.get(
          "https://dapi.kakao.com/v2/local/geo/coord2address.json",
          {
            params: {
              x: route.params.lng,
              y: route.params.lat,
            },
            headers: {
              Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}`,
            },
          }
        );

        setAddressForm((prev) => ({
          ...prev,
          nickname:
            response.data.documents[0].road_address?.building_name ?? "",
          buildingName:
            response.data.documents[0].road_address?.building_name ?? null,
          fullAddress: response.data.documents[0].address.address_name,
          region1DepthName:
            response.data.documents[0].address.region_1depth_name,
          region2DepthName:
            response.data.documents[0].address.region_2depth_name,
          region3DepthName:
            response.data.documents[0].address.region_3depth_name,
          roadName:
            response.data.documents[0].road_address?.address_name ?? null,
        }));
      };

      getAddresses();
    }, [route.params])
  );

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <KakaoMap
            width={screenWidth - getResponsiveSize(40)}
            height={screenWidth - getResponsiveSize(40)}
            lat={route.params.lat}
            lng={route.params.lng}
          />

          <CustomText marginTop={20} fontSize={18} fontWeight={"600"}>
            {addressForm.fullAddress}
          </CustomText>
          {addressForm.roadName && (
            <CustomText marginTop={4} color={colors.gray5} fontSize={16}>
              [도로명] {addressForm.roadName}
            </CustomText>
          )}

          <View style={styles.buttonArea}>
            <Pressable
              onPress={() => setNicknameType("HOME")}
              disabled={nicknameType === "HOME"}
              style={[
                nicknameType === "HOME"
                  ? {
                      backgroundColor: colors.white,
                      borderWidth: 1,
                      borderColor: colors.gray2,
                    }
                  : { backgroundColor: colors.gray1 },
                styles.nicknameButton,
              ]}
            >
              <CustomText
                color={nicknameType === "HOME" ? colors.black : colors.gray5}
                fontSize={15}
                fontWeight={"500"}
              >
                집
              </CustomText>
            </Pressable>

            <Pressable
              onPress={() => setNicknameType("COMPANY")}
              disabled={nicknameType === "COMPANY"}
              style={[
                nicknameType === "COMPANY"
                  ? {
                      backgroundColor: colors.white,
                      borderWidth: 1,
                      borderColor: colors.gray2,
                    }
                  : { backgroundColor: colors.gray1 },
                styles.nicknameButton,
              ]}
            >
              <CustomText
                color={nicknameType === "COMPANY" ? colors.black : colors.gray5}
                fontSize={15}
                fontWeight={"500"}
              >
                회사
              </CustomText>
            </Pressable>

            <Pressable
              onPress={() => setNicknameType("ETC")}
              disabled={nicknameType === "ETC"}
              style={[
                nicknameType === "ETC"
                  ? {
                      backgroundColor: colors.white,
                      borderWidth: 1,
                      borderColor: colors.gray2,
                    }
                  : { backgroundColor: colors.gray1 },
                styles.nicknameButton,
              ]}
            >
              <CustomText
                color={nicknameType === "ETC" ? colors.black : colors.gray5}
                fontSize={15}
                fontWeight={"500"}
              >
                기타
              </CustomText>
            </Pressable>
          </View>

          {nicknameType === "ETC" && (
            <CustomTextInput
              value={addressForm.nickname}
              onChangeText={(text) =>
                setAddressForm((prev) => ({
                  ...prev,
                  nickname: text,
                }))
              }
              onReset={() => {
                setAddressForm((prev) => ({
                  ...prev,
                  nickname: "",
                }));
              }}
              maxLength={30}
              marginTop={12}
            />
          )}
        </View>

        <CustomButton
          onPress={handleSubmit}
          width={"100%"}
          marginTop={20}
          backgroundColor={colors.main}
        >
          <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
            확인
          </CustomText>
        </CustomButton>
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: getResponsiveSize(32),
    gap: getResponsiveSize(14),
  },
  nicknameButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: getResponsiveSize(44),
    borderRadius: 8,
  },
});
