import { Image, StyleSheet, View, Alert, Linking } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { formatWeatherIcon, getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { recommendPhrases } from "@/constants";
import { cloudIcon, rainIcon, snowIcon, sunnyIcon } from "@/assets/images";
import { colors } from "@/styles";

export const WeatherCast = () => {
  // 아큐웨더 날씨 조회 요청
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
          ],
        );

        return;
      }
    }

    // 현재 좌표 조회
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const lat = loc.coords.latitude;
    const lng = loc.coords.longitude;

    //   // 좌표 -> 주소로 변환
    //   const kakaoRes = await axios.get(
    //     "https://dapi.kakao.com/v2/local/geo/coord2address.json",
    //     {
    //       headers: {
    //         Authorization:
    //           "KakaoAK " + process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY,
    //       },
    //       params: { x: lng, y: lat },
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
          q: `${lat},${lng}`,
          language: "ko-KR",
        },
      },
    );

    const locationKey = locationRes.data.Key;

    // 현재 날씨 조회
    const weatherRes = await axios.get(
      `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}`,
      {
        params: {
          apikey: process.env.EXPO_PUBLIC_ACCU_WEATHER_API_KEY,
          language: "ko-KR",
          details: true,
        },
      },
    );

    const weatherData = weatherRes.data[0];

    const weather = {
      weatherText: weatherData.WeatherText ?? null,
      weatherCode: weatherData.WeatherIcon ?? null,
      temperature: weatherData.Temperature.Metric.Value ?? null,
      humidity: weatherData.RelativeHumidity ?? null,
      hasPrecipitation: weatherData.HasPrecipitation,
      precipitationType: weatherData.PrecipitationType,
      currentPrecipitation:
        weatherData.PrecipitationSummary.PastHour.Metric.Value ?? null,
      totalPrecipitation:
        weatherData.PrecipitationSummary.Precipitation.Metric.Value ?? null,
    };

    return weatherData;
  };

  // 날씨 조회 쿼리
  const {
    data: weatherData,
    isLoading: weatherLoading,
    isError: weatherError,
  } = useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    staleTime: 1000 * 60 * 10,
  });

  // 현재 날씨에 맞는 랜덤 추천 문구
  const getRecommendPhrase = () => {
    if (!weatherData) return "";

    const matched = recommendPhrases.find(
      (weather) =>
        weather.weatherText === formatWeatherIcon(weatherData.WeatherIcon),
    );

    if (!matched || matched.phrases.length === 0) return "";

    const randomIndex = Math.floor(Math.random() * matched.phrases.length);

    return matched.phrases[randomIndex];
  };

  // 날씨 아이콘
  const getWeatherIcon = () => {
    if (!weatherData) return "";

    const weatherKind = formatWeatherIcon(weatherData.WeatherIcon);

    switch (weatherKind) {
      case "화창":
        return sunnyIcon;
      case "흐림":
        return cloudIcon;
      case "비":
        return rainIcon;
      case "눈":
        return snowIcon;
      default:
        return sunnyIcon;
    }
  };

  return (
    <View style={styles.container}>
      {weatherData ? (
        <>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={getWeatherIcon()} style={styles.icon} />
            <CustomText color={colors.black} fontSize={16}>
              오늘의 날씨는 '{weatherData.WeatherText ?? ""}'
            </CustomText>
          </View>

          <CustomText color={colors.black} fontSize={22} fontWeight={"600"}>
            {getRecommendPhrase()}
          </CustomText>
        </>
      ) : (
        <>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                styles.skeleton,
                {
                  width: getResponsiveSize(24),
                  marginRight: getResponsiveSize(8),
                },
              ]}
            />
            <View
              style={[styles.skeleton, { width: getResponsiveSize(110) }]}
            />
          </View>

          <View
            style={[
              styles.skeleton,
              {
                width: getResponsiveSize(194),
                marginTop: getResponsiveSize(6),
              },
            ]}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: getResponsiveSize(60),
    marginTop: getResponsiveSize(32),
  },
  icon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    marginRight: getResponsiveSize(8),
  },
  skeleton: {
    height: getResponsiveSize(24),
    backgroundColor: colors.gray2,
    borderRadius: 4,
  },
});
