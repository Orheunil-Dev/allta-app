import { inputResetButton } from "@/assets/images";
import { colors } from "@/styles";
import { getFontSize, getResponsiveSize } from "@/utils";
import {
  Image,
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  TextInputSubmitEditingEvent,
  TextStyle,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { CustomText } from "../CustomText/CustomText";
import { useState } from "react";

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
  onSubmitEditing?: ((e: TextInputSubmitEditingEvent) => void) | undefined;
  onReset?: () => void;
  maxLength?: number;
  placeholder?: string;
  errorMessage?: string;
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
  fontWeight?: TextStyle["fontWeight"];
  keyboardType?: KeyboardTypeOptions | undefined;
  secureTextEntry?: boolean;
  editable?: boolean;
}

export const CustomTextInput = ({
  value,
  onChangeText,
  onSubmitEditing,
  onReset,
  maxLength,
  placeholder,
  errorMessage,
  marginTop = 0,
  marginBottom = 0,
  marginRight = 0,
  marginLeft = 0,
  fontWeight = "400",
  keyboardType,
  secureTextEntry,
  editable = true,
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);

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
      {onReset && value && value?.length > 0 && (
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
        placeholder={placeholder ?? undefined}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable
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

      {errorMessage !== "null" && (
        <View style={styles.errorMessage}>
          <CustomText color="#EF3A2F" fontSize={13}>
            {errorMessage}
          </CustomText>
        </View>
      )}
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
  errorMessage: {
    position: "absolute",
    bottom: getResponsiveSize(-20),
    left: getResponsiveSize(10),
  },
});
