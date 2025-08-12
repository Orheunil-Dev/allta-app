import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";

interface Props {
  children?: React.ReactNode;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  isDisabled?: boolean;
  flex?: number;
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
  marginTop?: number;
  marginBottom?: number;
  marginRight?: number;
  marginLeft?: number;
  backgroundColor?: string;
  borderColor?: string;
}

export const CustomButton = ({
  children,
  onPress,
  isDisabled,
  flex,
  width = "auto",
  height = getResponsiveSize(45),
  marginTop = 0,
  marginBottom = 0,
  marginRight = 0,
  marginLeft = 0,
  backgroundColor = colors.white,
  borderColor = "transparent",
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        {
          flex: flex ?? undefined,
          width,
          height,
          marginTop: getResponsiveSize(marginTop),
          marginBottom: getResponsiveSize(marginBottom),
          marginRight: getResponsiveSize(marginRight),
          marginLeft: getResponsiveSize(marginLeft),
          backgroundColor,
          borderColor,
        },
        styles.button,
      ]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
});
