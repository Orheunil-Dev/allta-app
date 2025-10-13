import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PassStackParamList } from "@/navigations";
import {
  formatPassType,
  formatServiceType,
  formatUsageLeft,
  getResponsiveSize,
} from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { blackRightArrow } from "@/assets/images";
import {
  usePassControllerGetSubscriptionList,
  usePassControllerGetTicketList,
} from "@/api/pass/pass";
import { useEffect, useState } from "react";
import { Car, PassType, ServiceType } from "@/types";
import { PassFilter } from "@/components/pass";
import dayjs from "dayjs";
import { GetTicketListReponse } from "@/api/models";
import { MyPassCard } from "@/components/ui/Card";

type PassListRouteProp = RouteProp<PassStackParamList, "PassList">;

export const PassList = () => {
  const router = useRoute<PassListRouteProp>();

  const passStackNavigation =
    useNavigation<NativeStackNavigationProp<PassStackParamList>>();

  const [car, setCar] = useState<Car | null>(null);
  const [passType, setPassType] = useState<PassType | null>(
    router.params.passType ?? null
  );
  const [skip, setSkip] = useState<number>(0);
  const [tickets, setTickets] = useState<GetTicketListReponse["data"]>([]);

  const { data: ticketData, refetch: ticketRefetch } =
    usePassControllerGetTicketList(
      {
        carNumber: car?.number ?? "",
        take: 20,
        skip,
      },
      {
        query: {
          queryKey: ["tickets", car?.number, passType],
          enabled:
            !!car?.number && (passType === "TICKET" || passType === null),
          retry: false,
          gcTime: 0,
        },
      }
    );

  // 구독권 목록 조회 API
  const { data: subscriptionData, refetch: subscriptionRefetch } =
    usePassControllerGetSubscriptionList(
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
                    availablePeriod={`${dayjs(value.payedAt).format(
                      "YY.MM.DD"
                    )} ~ ${dayjs(value.payedAt)
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
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: getResponsiveSize(20),
  },
  card: {
    position: "relative",
    marginTop: getResponsiveSize(20),
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(16),
    backgroundColor: colors.back4,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.point2,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  bottom: {
    paddingVertical: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(20),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.point2,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: getResponsiveSize(6),
  },
});
