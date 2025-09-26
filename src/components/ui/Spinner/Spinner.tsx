import * as Progress from "react-native-progress";
import { colors } from "@/styles";

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
    <Progress.CircleSnail
      size={size}
      color={color}
      thickness={thickness}
      duration={750}
    />
  );
};
