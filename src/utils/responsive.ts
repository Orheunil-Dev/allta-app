import { PixelRatio } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const WIDTH_RESOLUTION = 375;
const HEIGHT_RESOLUTION = 812;

export const getResponsiveSize = (pixel: number) => {
  const percentage = (pixel / WIDTH_RESOLUTION) * 100;
  return wp(percentage);
};

export const getFontSize = (size: number) =>
  getResponsiveSize(size) / PixelRatio.getFontScale();
