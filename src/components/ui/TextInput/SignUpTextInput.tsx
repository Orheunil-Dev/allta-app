import { colors } from "@/styles";
import { getFontSize, getResponsiveSize } from "@/utils";
import { useState } from "react";
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from "react-native";
import { CustomText } from "../CustomText";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  maxLength?: number;
  placeholder?: string;
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
  errorMessage?: string;
}

export const SignUpTextInput = ({
  value,
  onChangeText,
  editable = true,
  maxLength = 20,
  keyboardType = "default",
  secureTextEntry = false,
  placeholder,
  marginTop = 0,
  marginBottom = 0,
  marginRight = 0,
  marginLeft = 0,
  errorMessage,
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
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        placeholder={placeholder}
        underlineColorAndroid="transparent"
        style={[
          {
            borderBottomColor:
              errorMessage && errorMessage !== "null"
                ? colors.red
                : isFocused
                ? colors.main
                : colors.gray5,
          },
          styles.textInput,
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
  container: { position: "relative", flex: 1 },
  textInput: {
    flex: 1,
    height: getResponsiveSize(42),
    paddingHorizontal: getResponsiveSize(8),
    fontSize: getFontSize(16),
    color: colors.black,
    borderBottomWidth: 1,
  },
  errorMessage: {
    position: "absolute",
    bottom: getResponsiveSize(-20),
    left: getResponsiveSize(10),
  },
});
