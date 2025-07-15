import { colors } from "@/styles";
import { Text, TextStyle } from "react-native";

interface Props {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
}

export const CustomText = ({
  text,
  color = colors.black,
  fontSize = 14,
  fontWeight = "400",
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
        marginTop,
        marginBottom,
        marginRight,
        marginLeft,
      }}
    >
      {text}
    </Text>
  );
};
