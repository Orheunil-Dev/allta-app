import * as Progress from "react-native-progress";
import { colors } from "@/styles";

export const Spinner = () => {
  return <Progress.CircleSnail size={40} color={colors.white} duration={750} />;
};
