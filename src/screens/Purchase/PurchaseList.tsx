import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import { usePurchaseControllerGetPurchaseList } from "@/api/purchase/purchase";
import { GetPurchaseListResponse } from "@/api/models";
import { PurchaseStackParamList } from "@/navigations";
import {
  formatPassType,
  formatPaymentStatus,
  getResponsiveSize,
} from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";

export const PurchaseList = () => {
  const purchaseNavigation =
    useNavigation<NativeStackNavigationProp<PurchaseStackParamList>>();

  const [skip, setSkip] = useState<number>(0);
  const [payments, setPayments] = useState<GetPurchaseListResponse["data"]>([]);

  // 결제 내역 목록 조회
  const {
    data: purchaseData,
    isLoading: purhcaseLoading,
    refetch: purchaseRefetch,
  } = usePurchaseControllerGetPurchaseList(
    {
      take: 20,
      skip,
    },
    {
      query: {
        retry: false,
        gcTime: 0,
      },
    }
  );

  // 페이지네이션
  const handleLoadMore = () => {
    if (purchaseData?.meta?.hasNextPage) {
      setSkip(skip + 20);
    }
  };

  // 무한 스크롤
  useEffect(() => {
    if (purchaseData?.data) {
      setPayments((prev) => [...prev, ...purchaseData.data]);
    }
  }, [purchaseData]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      {payments.length ? (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          contentContainerStyle={{ paddingVertical: getResponsiveSize(20) }}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() =>
                purchaseNavigation.navigate("PurchaseDetail", {
                  id: item.id,
                })
              }
              style={styles.itemBox}
            >
              <CustomText color={colors.gray7} fontSize={15} fontWeight={"600"}>
                {dayjs(item.createdAt).format("YY.MM.DD")}
              </CustomText>
              <CustomText
                color={
                  item.status === "REFUNDED" ||
                  item.status === "PARTIAL_REFUNDED"
                    ? colors.red
                    : colors.black
                }
                marginTop={16}
                fontSize={16}
                fontWeight={"600"}
              >
                {formatPaymentStatus(item.status)}
              </CustomText>

              <View style={styles.row}>
                <CustomText fontSize={18}>
                  {formatPassType(item.productType)}
                </CustomText>
                <CustomText fontSize={18} fontWeight={"600"}>
                  {item.totalAmount.toLocaleString()}원
                </CustomText>
              </View>

              <CustomText color={colors.gray5} fontSize={14}>
                {item.storeName}
                {item.carNumber ? ` • ${item.carNumber}` : ""}
              </CustomText>
            </Pressable>
          )}
        />
      ) : (
        <View style={styles.emptyBox}>
          <CustomText
            marginBottom={4}
            color={colors.gray5}
            fontSize={20}
            fontWeight={"600"}
          >
            결제 내역이 없습니다.
          </CustomText>
        </View>
      )}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemBox: {
    paddingTop: getResponsiveSize(12),
    paddingBottom: getResponsiveSize(16),
    paddingHorizontal: getResponsiveSize(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: getResponsiveSize(4),
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: getResponsiveSize(20),
  },
});
