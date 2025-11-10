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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";

type RegisterAddressRouteProp = RouteProp<
  AddressStackParamList,
  "RegisterAddress"
>;

const { width: screenWidth } = Dimensions.get("window");

export const RegisterAddress = () => {
  const router = useRoute<RegisterAddressRouteProp>();

  const addressNavigation =
    useNavigation<NativeStackNavigationProp<AddressStackParamList>>();

  const queryClient = useQueryClient();

  const insets = useSafeAreaInsets();

  const [addressForm, setAddressForm] = useState<RegisterAddresssRequest>({
    nickname: router.params.buildingName ?? "",
    buildingName: router.params.buildingName ?? null,
    fullAddress: router.params.fullAddress ?? "",
    lat: router.params.lat,
    lng: router.params.lng,
    region1DepthName: "",
    region2DepthName: "",
    region3DepthName: "",
    roadName: router.params.roadName ?? null,
  });
  const [nicknameType, setNicknameType] = useState<"HOME" | "COMPANY" | "ETC">(
    "ETC"
  );

  // 주소 등록 API
  const {
    mutate: registerAddress,
    isError: registerAddressError,
    isPending: regiserAddressLoading,
  } = useAddressControllerRegisterAddresses({});

  // 주소 등록
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
              x: router.params.lng,
              y: router.params.lat,
            },
            headers: {
              Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}`,
            },
          }
        );

        setAddressForm((prev) => ({
          ...prev,
          nickname:
            router.params.buildingName ??
            response.data.documents[0].road_address?.building_name ??
            "",
          buildingName:
            router.params.buildingName ??
            response.data.documents[0].road_address?.building_name ??
            "",
          fullAddress:
            router.params.fullAddress ??
            response.data.documents[0].address.address_name,
          region1DepthName:
            response.data.documents[0].address.region_1depth_name,
          region2DepthName:
            response.data.documents[0].address.region_2depth_name,
          region3DepthName:
            response.data.documents[0].address.region_3depth_name,
          roadName:
            router.params.roadName ??
            response.data.documents[0].road_address?.address_name ??
            response.data.documents[0].address.address_name ??
            null,
        }));
      };

      getAddresses();
    }, [router.params])
  );

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomKeyboardAvoidingView>
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <KakaoMap
              width={screenWidth}
              height={getResponsiveSize(320)}
              lat={router.params.lat}
              lng={router.params.lng}
            />

            <View style={{ flex: 1, paddingHorizontal: getResponsiveSize(20) }}>
              <CustomText marginTop={20} fontSize={18} fontWeight={"600"}>
                {addressForm.roadName}{" "}
                {addressForm.buildingName?.trim() &&
                  `(${addressForm.buildingName})`}
              </CustomText>
              {addressForm.roadName && (
                <CustomText marginTop={4} color={colors.gray5} fontSize={16}>
                  {addressForm.fullAddress}
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
                    color={
                      nicknameType === "HOME" ? colors.black : colors.gray5
                    }
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
                    color={
                      nicknameType === "COMPANY" ? colors.black : colors.gray5
                    }
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
                  placeholder="별명을 입력해주세요"
                />
              )}
            </View>
          </ScrollView>

          <CustomButton
            onPress={handleSubmit}
            alignSelf="center"
            width={screenWidth - getResponsiveSize(20)}
            marginTop={20}
            marginBottom={getResponsiveSize(20)}
            backgroundColor={colors.main}
          >
            <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
              확인
            </CustomText>
          </CustomButton>
        </View>
      </CustomKeyboardAvoidingView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
