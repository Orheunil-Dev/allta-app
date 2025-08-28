import { GetStoresResponse } from "@/api/models";
import { useStoreControllerGetStores } from "@/api/store/store";
import { StoreStackParamList } from "@/navigations";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type StoreRouteProp = RouteProp<StoreStackParamList, "Stores">;

export const Stores = () => {
  const route = useRoute<StoreRouteProp>();

  const [skip, setSkip] = useState<number>(0);
  const [passType, setPassType] = useState<
    "TICKET" | "STANDARD" | "PREMIUM" | undefined
  >(undefined);
  const [stores, setStores] = useState<GetStoresResponse["data"]>([]);

  const {
    data: storesData,
    isLoading: storesLoading,
    isError: storesError,
    refetch: storesRefetch,
  } = useStoreControllerGetStores({
    take: 20,
    skip,
    serviceType: route.params.serviceType,
    passType,
  });

  console.log(storesData);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          <Text>매장 둘러보기</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  headerLogo: {
    width: 58,
    height: 28,
  },
  alarm: {
    width: 24,
    height: 24,
  },
  container: {
    height: "100%",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  carouselContainer: { position: "relative", width: "100%", height: 200 },
  bannerCarousel: {
    width: "100%",
    height: "100%",
  },
  bannerCard: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  bannerImage: {
    width: "100%",
    height: 200,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  indicator: {
    position: "absolute",
    flexDirection: "row",
    right: 30,
    bottom: 10,
    width: "auto",
    height: "auto",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    backgroundColor: "rgba(38, 38, 39, 0.7)",
    borderRadius: 40,
  },
});
