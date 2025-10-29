import { colors, fontMap } from "@/styles";
import { getFontSize, getResponsiveSize } from "@/utils";
import { Text, TextStyle } from "react-native";

interface Props {
  children: React.ReactNode;
  flex?: number;
  color?: string;
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  textAlign?: TextStyle["textAlign"];
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
  letterSpacing?: number;
  lineHeight?: number;
  textDecorationLine?: TextStyle["textDecorationLine"];
  textDecorationColor?: TextStyle["textDecorationColor"];
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
  letterSpacing = -0.025,
  lineHeight = 1.5,
  textDecorationLine,
  textDecorationColor,
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
        letterSpacing: getFontSize(fontSize) * letterSpacing,
        lineHeight: getFontSize(fontSize) * lineHeight,
        textDecorationLine,
        textDecorationColor,
      }}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
};
