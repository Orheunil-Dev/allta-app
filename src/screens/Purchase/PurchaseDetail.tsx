import { StyleSheet } from "react-native";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";

export const PurchaseDetail = () => {
  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomText>안녕</CustomText>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({});
