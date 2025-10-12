import { Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingStackParamList } from "@/navigations";
import { getResponsiveSize } from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { terms } from "@/constants";
import { colors } from "@/styles";

export const TermsList = () => {
  const settingNavigation =
    useNavigation<NativeStackNavigationProp<SettingStackParamList>>();

  return (
    <View style={styles.container}>
      {terms.map((value, index) => (
        <Pressable
          onPress={() =>
            settingNavigation.navigate("TermsDetail", {
              title: value.title,
            })
          }
          key={index}
          style={styles.button}
        >
          <CustomText fontSize={16}>{value.title}</CustomText>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: getResponsiveSize(12),
  },
});
