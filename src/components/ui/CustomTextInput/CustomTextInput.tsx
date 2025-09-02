import { colors } from "@/styles";
import { getFontSize, getResponsiveSize } from "@/utils";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputSubmitEditingEventData,
  TextStyle,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

const fontMap: Record<string, string> = {
  "100": "Pretendard-Thin",
  "200": "Pretendard-ExtraLight",
  "300": "Pretendard-Light",
  "400": "Pretendard-Regular",
  "500": "Pretendard-Medium",
  "600": "Pretendard-SemiBold",
  "700": "Pretendard-Bold",
  "800": "Pretendard-ExtraBold",
  "900": "Pretendard-Black",
};

interface Props {
  value?: string | undefined;
  onChangeText?: ((text: string) => void) | undefined;
  onSubmitEditing?:
    | ((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void)
    | undefined;
  fontWeight?: TextStyle["fontWeight"];
}

export const CustomTextInput = ({
  value,
  onChangeText,
  onSubmitEditing,
  fontWeight = "400",
}: Props) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      style={[{ fontFamily: fontMap[fontWeight] }, styles.input]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: getResponsiveSize(8),
    fontSize: getFontSize(18),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray3,
  },
});
