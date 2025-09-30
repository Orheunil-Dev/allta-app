import * as Progress from "react-native-progress";
import { colors } from "@/styles";
import { View } from "react-native";

interface Props {
  size?: number;
  thickness?: number;
  color?: string;
}

export const Spinner = ({
  size = 40,
  thickness = 3,
  color = colors.white,
}: Props) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Progress.CircleSnail
        size={size}
        color={color}
        thickness={thickness}
        duration={750}
      />
    </View>
  );
};
