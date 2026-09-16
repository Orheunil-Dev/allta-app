import { Dimensions, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomImage } from "@/components/ui/CustomImage";
import { selfGuide } from "@/assets/images";

const { width: screenWidth } = Dimensions.get("window");

export const SelfGuide = () => {
  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <ScrollView>
        <CustomImage source={selfGuide} width={screenWidth} />
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
});
