import { colors } from "@/styles";
import { getFontSize, getResponsiveSize } from "@/utils";
import { Text, TextStyle } from "react-native";

const fontMap: Record<string, string> = {
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

interface Props {
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  textAlign?: TextStyle["textAlign"];
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
  lineHeight?: number;
}

export const CustomText = ({
  children,
  textAlign = "auto",
  marginTop = 0,
  marginBottom = 0,
  marginRight = 0,
  marginLeft = 0,
  color = colors.black,
  fontSize = 14,
  fontWeight = "400",
  lineHeight = 1.5,
}: Props) => {
  return (
    <Text
      style={{
        fontFamily: fontMap[fontWeight],
        textAlign,
        marginTop: getResponsiveSize(marginTop),
        marginBottom: getResponsiveSize(marginBottom),
        marginRight: getResponsiveSize(marginRight),
        marginLeft: getResponsiveSize(marginLeft),
        color,
        fontSize: getFontSize(fontSize),
        fontWeight,
        lineHeight: getFontSize(fontSize) * lineHeight,
      }}
    >
      {children}
    </Text>
  );
};
