import { Image, StyleSheet, View } from "react-native";
import { useCurrentWeather } from "@/hooks";
import { formatWeatherIcon, getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { cloudIcon, rainIcon, snowIcon, sunnyIcon } from "@/assets/images";
import { colors } from "@/styles";
import { recommendPhrases } from "@/constants";

export const WeatherCast = () => {
  // 날씨 조회 훅스
  const { weatherText, weatherIcon } = useCurrentWeather();

  // 현재 날씨에 맞는 랜덤 추천 문구
  const getRecommendPhrase = () => {
    const matched = recommendPhrases.find(
      (weather) => weather.weatherText === formatWeatherIcon(weatherIcon)
    );
    if (!matched || matched.phrases.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * matched.phrases.length);
    return matched.phrases[randomIndex];
  };

  // 날씨 아이콘
  const getWeatherIcon = () => {
    const weatherKind = formatWeatherIcon(weatherIcon);

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
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={getWeatherIcon()} style={styles.icon} />
        <CustomText color={colors.black} fontSize={16}>
          오늘의 날씨는 '{weatherText}'
        </CustomText>
      </View>
      <CustomText color={colors.black} fontSize={22} fontWeight={"600"}>
        {getRecommendPhrase()}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: getResponsiveSize(32),
  },
  icon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    marginRight: getResponsiveSize(8),
  },
});
