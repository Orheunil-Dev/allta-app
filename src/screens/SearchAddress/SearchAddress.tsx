import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { formatEllipsis, getFontSize, getResponsiveSize } from "@/utils";
import { useEffect, useState } from "react";
import { Alert, Image, Linking, StyleSheet, View } from "react-native";
import axios from "axios";
import { FlatList, Pressable, TextInput } from "react-native-gesture-handler";
import { colors, fontMap } from "@/styles";
import { CustomTextInput } from "@/components/ui/CustomTextInput";
import { CustomButton } from "@/components/ui/CustomButton";
import { myLocationIcon, searchIcon } from "@/assets/images";
import * as Location from "expo-location";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { AddressStackParamList } from "@/navigations";

type Address = {
  id: string;
  buildingName: string | null;
  fullAddress: string;
  roadName: string;
  lat: number;
  lng: number;
};

export const SearchAddress = () => {
  const addressNavigation =
    useNavigation<NativeStackNavigationProp<AddressStackParamList>>();

  const [keyword, setKeyword] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);

  const setCurrentLocation = async () => {
    let { status, canAskAgain } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      if (canAskAgain) {
        const res = await Location.requestForegroundPermissionsAsync();

        status = res.status;
      }

      if (status !== "granted") {
        Alert.alert(
          "위치정보 접근 권한이 없습니다",
          "앱 설정에서 위치정보 접근 권한을 허용할 수 있습니다. 이동하시겠습니까?",
          [
            {
              text: "닫기",
              style: "cancel",
              onPress: () => {
                return;
              },
            },
            {
              text: "설정",
              onPress: () => Linking.openSettings(),
            },
          ]
        );

        return;
      }
    }

    console.log("aaaaaaaaa");

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    console.log(loc);

    return addressNavigation.navigate("RegisterAddress", {
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
    });
  };

  useEffect(() => {
    if (!keyword.trim()) {
      return setAddresses([]);
    }

    const timer = setTimeout(() => {
      const getAddresses = async () => {
        const response = await axios.get(
          "https://dapi.kakao.com/v2/local/search/keyword.json",
          {
            params: { query: keyword },
            headers: {
              Authorization: `KakaoAK ${process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY}`,
            },
          }
        );

        const data: Address[] = response.data.documents.reduce(
          (acc: Address[], value: any) => {
            const uniqueKey = value.address_name;

            if (!acc.some((item) => item.fullAddress === uniqueKey)) {
              acc.push({
                id: value.id,
                buildingName: value.place_name,
                fullAddress: uniqueKey,
                roadName: value.road_address_name.trim()
                  ? value.road_address_name
                  : value.address_name,
                lat: parseFloat(value.y),
                lng: parseFloat(value.x),
              });
            }

            return acc;
          },
          []
        );

        setAddresses(data);
      };

      getAddresses();
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Image
              source={searchIcon}
              style={[
                styles.icon,
                { position: "absolute", left: getResponsiveSize(12) },
              ]}
            />

            <TextInput
              value={keyword}
              onChangeText={(text) => setKeyword(text)}
              keyboardType="default"
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={colors.gray5}
              placeholder="지번, 도로명, 건물명으로 검색"
              maxLength={50}
              underlineColorAndroid="transparent"
              style={styles.input}
            />
          </View>

          <CustomButton
            onPress={setCurrentLocation}
            width={"100%"}
            marginTop={10}
            marginBottom={20}
            borderColor={colors.gray2}
            borderWidth={1}
          >
            <Image source={myLocationIcon} style={styles.icon} />
            <CustomText marginLeft={4} fontSize={15} fontWeight={"500"}>
              현재 위치로 설정
            </CustomText>
          </CustomButton>
        </View>

        {addresses.length > 0 && (
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  return addressNavigation.navigate("RegisterAddress", {
                    fullAddress: item.fullAddress,
                    roadName: item.roadName,
                    buildingName: item.buildingName,
                    lat: Number(item.lat),
                    lng: Number(item.lng),
                  });
                }}
                style={styles.card}
              >
                <CustomText fontSize={15} fontWeight={"500"}>
                  {item.roadName}{" "}
                  {item.buildingName?.trim() && `(${item.buildingName})`}
                </CustomText>
                <CustomText marginTop={4} color={colors.gray5} fontSize={13}>
                  {item.fullAddress}
                </CustomText>
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
    paddingBottom: getResponsiveSize(20),
  },
  inputContainer: {
    paddingTop: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(20),
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    height: getResponsiveSize(43),
    paddingRight: getResponsiveSize(12),
    paddingLeft: getResponsiveSize(40),
    backgroundColor: colors.gray1,
    fontFamily: fontMap["500"],
    fontSize: getFontSize(15),
    fontWeight: "500",
    borderRadius: 8,
  },
  icon: {
    width: getResponsiveSize(20),
    height: getResponsiveSize(20),
    zIndex: 1,
  },
  listContainer: {
    gap: getResponsiveSize(8),
  },
  card: {
    paddingVertical: getResponsiveSize(16),
    paddingHorizontal: getResponsiveSize(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray2,
  },
});
