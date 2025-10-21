import { useEffect } from "react";
import { Alert, Linking } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

export const useCurrentWeather = () => {
  // 날씨 조회
  useEffect(() => {
    const fetchWeather = async () => {
      // 위치 권한 요청
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

      // 현재 좌표 조회
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });

      const lat = loc.coords.latitude;
      const lon = loc.coords.longitude;

      //   // 좌표 -> 주소로 변환
      //   const kakaoRes = await axios.get(
      //     "https://dapi.kakao.com/v2/local/geo/coord2address.json",
      //     {
      //       headers: {
      //         Authorization:
      //           "KakaoAK " + process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
      //       },
      //       params: { x: lon, y: lat },
      //     }
      //   );

      //   const locationName =
      //     kakaoRes.data.documents[0]?.address?.region_2depth_name ?? undefined;

      // 아큐웨더 API LocationKey 조회
      const locationRes = await axios.get(
        `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search`,
        {
          params: {
            apikey: process.env.EXPO_PUBLIC_ACCU_WEATHER_API_KEY,
            q: `${lat},${lon}`,
            language: "ko-KR",
          },
        }
      );

      const locationKey = locationRes.data.Key;

      // 현재 날씨 조회
      const weatherRes = await axios.get(
        `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}`,
        {
          params: {
            apikey: process.env.EXPO_PUBLIC_ACCU_WEATHER_API_KEY,
            language: "ko-KR",
            details: false,
          },
        }
      );

      const weatherData = weatherRes.data[0];

      console.log(weatherData);
    };

    fetchWeather();
  }, []);
};
