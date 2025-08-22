import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
}

export const CustomSafeAreaView = ({ children }: Props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      edges={["top", "left", "right"]}
    >
      {children}
    </SafeAreaView>
  );
};
