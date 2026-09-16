import { Image, StyleSheet, View, Alert, Linking } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { formatWeatherIcon, getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { cloudIcon, rainIcon, snowIcon, sunnyIcon } from "@/assets/images";
import { colors } from "@/styles";
import { weatherPhraseKeys } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { AppLanguage, DEFAULT_LANGUAGE } from "@/i18n";

// 앱 언어별 아큐웨더 API language 파라미터
const ACCU_WEATHER_LANGUAGE: Record<AppLanguage, string> = {
  "zh-TW": "zh-tw",
  ko: "ko-kr",
};

export const WeatherCast = () => {
  const { t, i18n } = useTranslation("home");
  const accuWeatherLanguage =
    ACCU_WEATHER_LANGUAGE[i18n.language as AppLanguage] ??
    ACCU_WEATHER_LANGUAGE[DEFAULT_LANGUAGE];

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
          t("locationPermission.title"),
          t("locationPermission.message"),
          [
            { text: t("common:close"), style: "cancel" },
            {
              text: t("locationPermission.settings"),
              onPress: () => Linking.openSettings(),
            },
          ]
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
          language: accuWeatherLanguage,
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
          language: accuWeatherLanguage,
          details: true,
        },
      }
    );

    const weatherData = weatherRes.data[0];

    const weather = {
      weatherText: weatherData.WeatherText ?? null,
      weatherCode: weatherData.WeatherIcon ?? null,
      temperature: weatherData.Temperature.Metric.Value ?? null,
      humidity: weatherData.RelativeHumidity ?? null,
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

    const phraseKey =
      weatherPhraseKeys[formatWeatherIcon(weatherData.WeatherIcon)];

    if (!phraseKey) return "";

    const phrases = t(phraseKey, { returnObjects: true }) as string[];

    if (!Array.isArray(phrases) || phrases.length === 0) return "";

    const randomIndex = Math.floor(Math.random() * phrases.length);

    return phrases[randomIndex];
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
              {t("weather.today", { weather: weatherData.WeatherText ?? "" })}
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
