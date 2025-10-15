import { useStoreControllerGetStoreList } from "@/api/store/store";
import { homeMoreArrow } from "@/assets/images";
import { RecommendCard } from "@/components/ui/Card";
import { CustomText } from "@/components/ui/CustomText";
import { ContainerStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import * as Location from "expo-location";
import { useDistanceCalculator } from "@/hooks";

export const StoreRecommend = () => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const [coordinate, setCoordinate] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 37.5759785,
    lng: 127.1935115,
  });

  const {
    data: storesData,
    isLoading: storesLoading,
    isError: storesError,
    refetch: storesRefetch,
  } = useStoreControllerGetStoreList(
    {
      take: 3,
      skip: 0,
      ...(coordinate ? { lat: coordinate.lat, lng: coordinate.lng } : {}),
    },
    {
      query: {
        retry: false,
        gcTime: 0,
      },
    }
  );

  const { getDistance } = useDistanceCalculator();

  // 현위치 가져오기
  useFocusEffect(
    useCallback(() => {
      let isFocused = true;

      const fetchLocation = async () => {
        let { status, canAskAgain } =
          await Location.requestForegroundPermissionsAsync();

        // 권한 설정 안되있을 경우
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
                { text: "닫기", style: "cancel" },
                {
                  text: "설정",
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
            return;
          }
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        if (isFocused) {
          setCoordinate({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          });
        }
      };

      fetchLocation();

      return () => {
        isFocused = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.myStore}>
        <CustomText color={colors.black} fontSize={18} fontWeight={"600"}>
          추천 매장
        </CustomText>

        <Pressable
          onPress={() =>
            containerNavigation.navigate("StoreStack", {
              screen: "StoreList",
              params: { serviceType: "AUTO" },
            })
          }
          style={styles.moreStore}
        >
          <CustomText color={colors.gray5} fontSize={12} fontWeight={"600"}>
            더보기
          </CustomText>

          <Image source={homeMoreArrow} style={styles.moreIcon} />
        </Pressable>
      </View>

      <View style={styles.myStoreList}>
        {storesData &&
          storesData?.data.length > 0 &&
          storesData.data.map((value, index) => (
            <RecommendCard
              key={index}
              name={value.name}
              address={value.address}
              mainImage={value.mainImage}
              distance={getDistance(
                coordinate.lat,
                coordinate.lng,
                value.lat,
                value.lng
              )}
            />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  myStore: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    width: "100%",
    marginTop: getResponsiveSize(40),
    marginBottom: getResponsiveSize(12),
  },
  moreStore: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreIcon: {
    width: getResponsiveSize(20),
    height: getResponsiveSize(20),
  },
  myStoreList: {
    marginBottom: getResponsiveSize(40),
  },
});
