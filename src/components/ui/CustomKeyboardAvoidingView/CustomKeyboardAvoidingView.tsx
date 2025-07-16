import React, { ReactNode, useEffect } from "react";
import { Keyboard, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  useKeyboardController,
} from "react-native-keyboard-controller";
import { getResponsiveSize } from "@/utils";

interface ICustomKeyboardAvoid {
  children: ReactNode;
}

export const CustomKeyboardAvoidingView = ({
  children,
}: ICustomKeyboardAvoid) => {
  const insets = useSafeAreaInsets();
  const { enabled, setEnabled } = useKeyboardController();

  useEffect(() => {
    if (Platform.OS === "android") {
      const show = Keyboard.addListener("keyboardWillShow", () => {
        setEnabled(true);
      });

      return () => {
        setEnabled(false);
        show.remove();
      };
    }

    if (Platform.OS === "ios") {
      setEnabled(true);

      return () => {
        setEnabled(false);
      };
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={enabled}
      keyboardVerticalOffset={
        Platform.OS === "ios"
          ? getResponsiveSize(68 + insets.bottom)
          : getResponsiveSize(81)
      }
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
