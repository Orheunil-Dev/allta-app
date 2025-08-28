import { getResponsiveSize } from "@/utils";
import { ReactNode } from "react";
import { SafeAreaView, Edges } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
  edges: Edges | undefined;
  paddinBottom?: number;
}

export const CustomSafeAreaView = ({
  children,
  edges,
  paddinBottom = 0,
}: Props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingBottom: getResponsiveSize(paddinBottom),
      }}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};
