import { StyleSheet } from "react-native";

export const colors = {
  black: "#262627",
  white: "#FFFFFF",
  main: "#6865E7",
  bg: "#F6F6F9",
  line: "#ECECEE",
  point1: "#202046",
  point2: "#6865E7",
  back1: "#61618A",
  back4: "#F2F2FD",
  gray1: "#F7F7F8",
  gray2: "#DDDDDF",
  gray3: "#C2C2C7",
  gray4: "#A7A7AE",
  gray5: "#8D8D96",
  gray6: "#73737D",
  gray7: "#5B5B62",
  red: "#EF3A2F",
};

export const fontMap: Record<string, string> = {
  "100": "Pretendard-Thin",
  "200": "Pretendard-ExtraLight",
  "300": "Pretendard-Light",
  "400": "Pretendard-Regular",
  "500": "Pretendard-Medium",
  "600": "Pretendard-SemiBold",
  "700": "Pretendard-Bold",
  "800": "Pretendard-ExtraBold",
  "900": "Pretendard-Black",
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
