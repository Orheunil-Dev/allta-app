import { colors } from "@/styles";
import { Text, TextStyle } from "react-native";

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
}

export const CustomText = ({
  children,
  color = colors.black,
  fontSize = 14,
  fontWeight = "400",
  textAlign = "auto",
  marginTop = 0,
  marginBottom = 0,
  marginRight = 0,
  marginLeft = 0,
}: Props) => {
  return (
    <Text
      style={{
        color,
        fontSize,
        fontWeight,
        textAlign,
        marginTop,
        marginBottom,
        marginRight,
        marginLeft,
      }}
    >
      {children}
    </Text>
  );
};
