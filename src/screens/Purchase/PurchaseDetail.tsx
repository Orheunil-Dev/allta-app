import { StyleSheet } from "react-native";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { RouteProp, useRoute } from "@react-navigation/native";
import { PurchaseStackParamList } from "@/navigations";
import { usePurchaseControllerGetPurchaseDetail } from "@/api/purchase/purchase";

type PurchaseDetailRouteProp = RouteProp<
  PurchaseStackParamList,
  "PurchaseDetail"
>;

export const PurchaseDetail = () => {
  const router = useRoute<PurchaseDetailRouteProp>();

  const {
    data: purchaseData,
    isLoading: purchaseLoading,
    isError: purchaseError,
  } = usePurchaseControllerGetPurchaseDetail(router.params.id, {
    query: { enabled: !!router.params.id },
  });

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CustomText>결제 내역</CustomText>
      <CustomText>{purchaseData?.data.status}</CustomText>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({});
