import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { PassStackParamList } from "@/navigations";
import {
  usePassControllerGetSubscriptionList,
  usePassControllerGetTicketList,
} from "@/api/pass/pass";
import { GetTicketListReponse } from "@/api/models";
import { getResponsiveSize } from "@/utils";
import { Car, PassType, ServiceType } from "@/types";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { PassFilter } from "@/components/pass";
import { MyPassCard } from "@/components/ui/Card";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";

type PassListRouteProp = RouteProp<PassStackParamList, "PassList">;

export const PassList = () => {
  const router = useRoute<PassListRouteProp>();

  const [car, setCar] = useState<Car | null>(null);
  const [passType, setPassType] = useState<PassType | null>(
    router.params.passType ?? null
  );
  const [skip, setSkip] = useState<number>(0);
  const [tickets, setTickets] = useState<GetTicketListReponse["data"]>([]);

  const {
    data: ticketData,
    isLoading: ticketLoading,
    refetch: ticketRefetch,
  } = usePassControllerGetTicketList(
    {
      carNumber: car?.number ?? "",
      take: 20,
      skip,
    },
    {
      query: {
        queryKey: ["tickets", car?.number, passType],
        enabled: !!car?.number && (passType === "TICKET" || passType === null),
        retry: false,
        gcTime: 0,
      },
    }
  );

  // 구독권 목록 조회 API
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    refetch: subscriptionRefetch,
  } = usePassControllerGetSubscriptionList(
    {
      carNumber: car?.number ?? "",
      ...(passType === "STANDARD" || passType === "PREMIUM"
        ? { subscriptionType: passType }
        : {}),
    },
    {
      query: {
        queryKey: ["subscriptions", car?.number, passType],
        enabled: !!car?.number && passType !== "TICKET",
        retry: false,
        gcTime: 0,
      },
    }
  );

  // 페이지네이션
  const handleLoadMore = () => {
    if (ticketData?.meta?.hasNextPage) {
      setSkip(skip + 20);
    }
  };

  // 필터 변경 시 일회권 초기화
  useEffect(() => {
    setTickets([]);
    setSkip(0);
  }, [passType, car]);

  // 일회권 목록 무한 스크롤
  useEffect(() => {
    if (ticketData?.data) {
      setTickets((prev) => [...prev, ...ticketData.data]);
    }
  }, [ticketData]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <PassFilter
        car={car}
        setCar={setCar}
        passType={passType}
        setPassType={setPassType}
      />

      <View style={styles.container}>
        {tickets.length ||
        subscriptionData?.data.length ||
        ticketLoading ||
        subscriptionLoading ? (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.7}
            style={{
              paddingHorizontal: getResponsiveSize(20),
            }}
            contentContainerStyle={{ paddingBottom: getResponsiveSize(20) }}
            ListHeaderComponent={
              <View>
                {passType !== "TICKET" &&
                  subscriptionData?.data.map((value, index) => (
                    <MyPassCard
                      key={value.id}
                      id={value.id}
                      type={value.type as PassType}
                      serviceType={value.serviceType as ServiceType}
                      storeName={value.storeName}
                      usage={value.subscriptionSnapshot.usage}
                      maxUsage={
                        value.subscriptionSnapshot.maxUsage ?? undefined
                      }
                      availablePeriod={`${dayjs(value.paidAt).format(
                        "YY.MM.DD"
                      )}~${dayjs(value.paidAt)
                        .add(1, "month")
                        .format("YY.MM.")}${value.billingDate}`}
                    />
                  ))}
              </View>
            }
            renderItem={({ item, index }) => (
              <MyPassCard
                key={item.id}
                id={item.id}
                type="TICKET"
                serviceType={item.serviceType as ServiceType}
                storeName={item.storeName}
                availablePeriod={`${dayjs(item.createdAt).format(
                  "YY.MM.DD"
                )} ~ ${dayjs(item.expiredAt).format("YY.MM.DD")}`}
              />
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
              보유하신 이용권이 없습니다.
            </CustomText>
          </View>
        )}
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: getResponsiveSize(20),
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
