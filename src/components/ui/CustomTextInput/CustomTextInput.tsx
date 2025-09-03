import { inputResetButton } from "@/assets/images";
import { colors } from "@/styles";
import { getFontSize, getResponsiveSize } from "@/utils";
import {
  Image,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInputSubmitEditingEventData,
  TextStyle,
  View,
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
  onReset?: () => void;
  maxLength?: number;
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
  fontWeight?: TextStyle["fontWeight"];
}

export const CustomTextInput = ({
  value,
  onChangeText,
  onSubmitEditing,
  onReset,
  maxLength,
  marginTop = 0,
  marginBottom = 0,
  marginRight = 0,
  marginLeft = 0,
  fontWeight = "400",
}: Props) => {
  return (
    <View
      style={[
        {
          marginTop: getResponsiveSize(marginTop),
          marginBottom: getResponsiveSize(marginBottom),
          marginRight: getResponsiveSize(marginRight),
          marginLeft: getResponsiveSize(marginLeft),
        },
        styles.container,
      ]}
    >
      {onReset && (
        <Pressable onPress={onReset} style={styles.resetButton}>
          <Image
            source={inputResetButton}
            style={{
              width: getResponsiveSize(20),
              height: getResponsiveSize(20),
            }}
          />
        </Pressable>
      )}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        maxLength={maxLength}
        style={[
          {
            fontFamily: fontMap[fontWeight],
            paddingRight: onReset
              ? getResponsiveSize(32)
              : getResponsiveSize(8),
          },
          styles.input,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: "relative", flexShrink: 1, justifyContent: "center" },
  input: {
    paddingVertical: getResponsiveSize(8),
    paddingLeft: getResponsiveSize(8),
    fontSize: getFontSize(18),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray3,
  },
  resetButton: {
    position: "absolute",
    right: getResponsiveSize(8),
    zIndex: 1,
  },
});
