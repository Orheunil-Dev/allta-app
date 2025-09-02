import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { getResponsiveSize } from "@/utils";
import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import axios from "axios";
import { FlatList, Pressable } from "react-native-gesture-handler";
import { colors } from "@/styles";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import { CustomButton } from "@/components/ui/CustomButton";
import { myLocationIcon } from "@/assets/images";
import * as Location from "expo-location";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AddressStackParamList } from "@/navigations";

type Address = {
  id: string;
  fullAddress: string;
  roadName: string;
  lat: number;
  lng: number;
};

type RegisterCompleteRouteProp = RouteProp<
  AddressStackParamList,
  "RegisterAddress"
>;

export const RegisterAddress = () => {
  const route = useRoute<RegisterCompleteRouteProp>();

  console.log(route.params);

  const addressNavigation =
    useNavigation<NativeStackNavigationProp<AddressStackParamList>>();

  const [keyword, setKeyword] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);

  const setCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return addressNavigation.navigate("RegisterAddress", {
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
    });
  };

  useEffect(() => {
    if (!keyword.trim()) {
      return;
    }

    const getAddresses = async () => {
      const response = await axios.get(
        "https://dapi.kakao.com/v2/local/search/keyword.json",
        {
          params: {
            query: keyword,
          },
          headers: {
            Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}`,
          },
        }
      );

      const data: Address[] = response.data.documents.map((value: any) => ({
        id: value.id,
        fullAddress: value.address_name,
        roadName: value.road_address_name.length
          ? value.road_address_name
          : value.address_name,
        lat: parseFloat(value.y),
        lng: parseFloat(value.x),
      }));

      setAddresses(data);
    };

    getAddresses();
  }, [keyword]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <View style={styles.container}>
        {/* <KakaoMap lat={coordinate.lat} lng={coordinate.lng} /> */}

        <CustomTextInput
          onSubmitEditing={(e) => setKeyword(e.nativeEvent.text)}
        />

        <CustomButton
          onPress={setCurrentLocation}
          width={"100%"}
          marginTop={10}
          marginBottom={20}
          borderColor={colors.gray2}
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
            contentContainerStyle={styles.listContainer}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  return addressNavigation.navigate("RegisterAddress", {
                    lat: Number(item.lat),
                    lng: Number(item.lng),
                  });
                }}
                style={styles.card}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <CustomText marginRight={10}>지번</CustomText>
                  <CustomText fontSize={16}>{item.fullAddress}</CustomText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <CustomText marginRight={10}>도로명</CustomText>
                  <CustomText fontSize={16}>{item.roadName}</CustomText>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(40),
  },
  input: {
    padding: getResponsiveSize(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray2,
  },
  locationIcon: {
    width: getResponsiveSize(20),
    height: getResponsiveSize(20),
    marginRight: getResponsiveSize(4),
  },
  listContainer: {
    gap: getResponsiveSize(8),
  },
  card: {
    padding: getResponsiveSize(16),
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
  },
});
