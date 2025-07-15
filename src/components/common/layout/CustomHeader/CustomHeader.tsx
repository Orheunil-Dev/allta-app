import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { headerBackArrow } from "@/assets/images";
import { CustomText } from "@/components/ui/CustomText";

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export const CustomHeader = ({ title, showBackButton }: CustomHeaderProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      {showBackButton && (
        <Pressable onPress={() => navigation.goBack()}>
          <Image source={headerBackArrow} style={styles.backButton} />
        </Pressable>
      )}

      <CustomText fontSize={20} textAlign="center">
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
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    width: 24,
    height: 24,
  },
  side: { width: 24, height: 24 },
});
