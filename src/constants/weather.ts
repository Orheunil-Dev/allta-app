// formatWeatherIcon이 반환하는 내부 날씨 구분값을 home 네임스페이스의 추천 문구 키와 연결
export const weatherPhraseKeys: Record<string, string> = {
  화창: "weather.phrases.sunny",
  흐림: "weather.phrases.cloudy",
  비: "weather.phrases.rain",
  눈: "weather.phrases.snow",
};
