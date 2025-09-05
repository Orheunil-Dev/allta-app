import { View, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { headerBackArrow } from "@/assets/images";
import { colors } from "@/styles";

interface CustomHeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export const CustomHeader = ({ title, showBackButton }: CustomHeaderProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        { paddingTop: insets.top + getResponsiveSize(10) },
      ]}
    >
      {showBackButton && (
        <Pressable onPress={() => navigation.goBack()}>
          <Image source={headerBackArrow} style={styles.backButton} />
        </Pressable>
      )}

      <CustomText fontSize={20} fontWeight={"600"} textAlign="center">
        {title}
      </CustomText>

      <View style={styles.side} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    paddingHorizontal: getResponsiveSize(20),
    paddingVertical: getResponsiveSize(24),
  },
  backButton: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
  side: { width: getResponsiveSize(24), height: getResponsiveSize(24) },
});
