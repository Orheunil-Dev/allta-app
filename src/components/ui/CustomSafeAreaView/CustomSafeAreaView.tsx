import { ReactNode } from "react";
import {
  SafeAreaView,
  Edges,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { getResponsiveSize } from "@/utils";
import { colors } from "@/styles";

interface Props {
  children: ReactNode;
  edges: Edges | undefined;
  paddinBottom?: number;
  backgroundColor?: string;
}

export const CustomSafeAreaView = ({
  children,
  edges,
  paddinBottom = 0,
  backgroundColor = colors.white,
}: Props) => {
  // const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
        paddingBottom: getResponsiveSize(paddinBottom),
      }}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};
