import { ReactNode } from "react";
import { SafeAreaView, Edges } from "react-native-safe-area-context";
import { getResponsiveSize } from "@/utils";

interface Props {
  children: ReactNode;
  edges: Edges | undefined;
}

export const CustomSafeAreaView = ({ children, edges }: Props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingBottom: getResponsiveSize(20),
      }}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};
