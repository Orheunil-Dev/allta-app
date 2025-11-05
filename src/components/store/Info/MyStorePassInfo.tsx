import { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import dayjs from "dayjs";
import { useCarControllerGetCarList } from "@/api/car/car";
import {
  usePassControllerGetStoreSubscriptionList,
  usePassControllerGetStoreTicketList,
} from "@/api/pass/pass";
import { GetStoreTicketListResponse } from "@/api/models";
import {
  formatPassType,
  formatServiceType,
  formatUsageLeft,
  getResponsiveSize,
} from "@/utils";
import { Car } from "@/types";
import { CustomText } from "@/components/ui/CustomText";
import { grayDownArrow } from "@/assets/images";
import { colors } from "@/styles";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  storeId: string;
}

const { width: screenWidth } = Dimensions.get("window");

export const MyStorePassInfo = ({ storeId }: Props) => {
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [car, setCar] = useState<Car | undefined>(undefined);
  const [skip, setSkip] = useState<number>(0);
  const [tickets, setTickets] = useState<GetStoreTicketListResponse["data"]>(
    []
  );

  // 차량 목록 조회 API
  const { data: carData, refetch: carsRefetch } = useCarControllerGetCarList({
    query: {
      queryKey: ["cars"],
      retry: false,
      gcTime: 0,
    },
  });

  // 일회권 목록 조회 API
  const {
    data: ticketData,
    isLoading: ticketLoading,
    isError: ticketError,
  } = usePassControllerGetStoreTicketList(
    {
      storeId,
      carNumber: car?.number ?? "",
      take: 10,
      skip,
    },
    {
      query: {
        queryKey: ["storeTickets", car?.number, skip],
        enabled: !!car?.number,
        gcTime: 0,
      },
    }
  );

  // 구독권 목록 조회 API
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    isError: subscriptionError,
  } = usePassControllerGetStoreSubscriptionList(
    {
      storeId,
      carNumber: car?.number ?? "",
    },
    {
      query: {
        queryKey: ["storeSubscriptions", car?.number],
        enabled: !!car?.number,
        gcTime: 0,
      },
    }
  );

  // 다음 페이지 요청
  const handleLoadMore = () => {
    if (ticketData?.meta?.hasNextPage) {
      setSkip(skip + 10);
    }
  };

  // 차량 변경
  const handleChangeCar = (car: Car) => () => {
    setCar(car);
    setTickets([]);
  };

  // 차량 설정
  useEffect(() => {
    if (carData) {
      setCar(carData.data.find((car) => car.isMain) ?? carData.data[0]);
    }
  }, [carData]);

  // 무한 스크롤
  useEffect(() => {
    if (!ticketData?.data) return;

    setTickets((prev) => {
      if (skip === 0) {
        return ticketData.data;
      }

      return [...prev, ...ticketData.data];
    });
  }, [ticketData]);

  return (
    <View style={styles.infoArea}>
      {/* 차량 필터 */}
      <ScrollView
        horizontal
        scrollEnabled={scrollEnabled}
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={(contentWidth) => {
          setScrollEnabled(contentWidth > screenWidth - getResponsiveSize(40));
        }}
        contentContainerStyle={styles.filter}
      >
        {carData?.data.map((value, index) => (
          <Pressable
            key={index}
            onPress={handleChangeCar(value)}
            style={[
              styles.filterButton,
              car?.id === value.id
                ? { borderBottomColor: colors.black }
                : { borderBottomColor: "transparent" },
            ]}
          >
            <CustomText
              textAlign="center"
              color={car?.id === value.id ? colors.black : colors.gray5}
              fontSize={14}
            >
              {value.number}
            </CustomText>
          </Pressable>
        ))}
      </ScrollView>

      {/* 구독권 목록 */}
      <View
        style={{
          marginBottom: getResponsiveSize(16),
          gap: getResponsiveSize(16),
        }}
      >
        {subscriptionData &&
          subscriptionData.data.map((value, index) => (
            <View key={value.id} style={styles.card}>
              <View style={styles.row}>
                <CustomText
                  color={colors.point2}
                  fontSize={16}
                  fontWeight={"600"}
                >
                  {formatPassType(value.type)}
                </CustomText>

                {value.type === "STANDARD" && (
                  <View style={{ flexDirection: "row" }}>
                    <CustomText
                      color={
                        formatUsageLeft(
                          value.subscriptionSnapshot.usage ?? 0,
                          value.subscriptionSnapshot.maxUsage ?? 0
                        ) > 0
                          ? colors.point2
                          : colors.gray5
                      }
                      fontSize={15}
                      fontWeight={"500"}
                    >
                      {`${formatUsageLeft(
                        value.subscriptionSnapshot.usage ?? 0,
                        value.subscriptionSnapshot.maxUsage ?? 0
                      )}`}
                    </CustomText>
                    <CustomText fontSize={15} fontWeight={"500"}>
                      /{value.subscriptionSnapshot.maxUsage} 회
                    </CustomText>
                  </View>
                )}
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <CustomText fontSize={16}>
                  {formatServiceType(value.serviceType)}
                </CustomText>
                <CustomText color={colors.gray5} fontSize={16}>
                  {dayjs(value.paidAt).format("YY.MM.DD")} ~{" "}
                  {dayjs(value.paidAt).add(1, "month").format("YY.MM.")}
                  {value.billingDate}
                </CustomText>
              </View>
            </View>
          ))}
      </View>

      {/* 일회권 목록 */}
      {tickets.length > 0 && (
        <View style={styles.card}>
          <View style={styles.row}>
            <CustomText color={colors.point2} fontSize={16} fontWeight={"600"}>
              일회권
            </CustomText>
          </View>

          <View style={styles.divider} />

          {tickets.map((value, index) => (
            <View key={value.id} style={styles.row}>
              <CustomText fontSize={16}>
                {formatServiceType(value.serviceType)}
              </CustomText>
              <CustomText color={colors.gray5} fontSize={16}>
                {dayjs(value.createdAt).format("YY.MM.DD")} ~{" "}
                {dayjs(value.expiredAt).format("YY.MM.DD")}
              </CustomText>
            </View>
          ))}

          {ticketData?.meta.hasNextPage && (
            <Pressable onPress={handleLoadMore} style={styles.loadButton}>
              <CustomText color={colors.gray5} fontSize={16}>
                더보기
              </CustomText>
              <Image
                source={grayDownArrow}
                style={{
                  width: getResponsiveSize(24),
                  height: getResponsiveSize(24),
                }}
              />
            </Pressable>
          )}
        </View>
      )}

      {!tickets.length && !subscriptionData?.data.length && (
        <View style={styles.emptyBox}>
          <CustomText
            marginBottom={4}
            color={colors.gray5}
            fontSize={20}
            fontWeight={"600"}
          >
            보유 이용권이 없습니다.
          </CustomText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoArea: {
    paddingVertical: getResponsiveSize(24),
    paddingHorizontal: getResponsiveSize(20),
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getResponsiveSize(16),
  },
  filterButton: {
    width: getResponsiveSize(80),
    paddingVertical: getResponsiveSize(4),
    borderBottomWidth: 2,
  },
  card: {
    paddingVertical: getResponsiveSize(4),
    paddingHorizontal: getResponsiveSize(16),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: getResponsiveSize(8),
  },
  loadButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: getResponsiveSize(8),
  },
  divider: {
    width: "100%",
    height: 1,
    marginVertical: getResponsiveSize(2),
    backgroundColor: colors.line,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: getResponsiveSize(40),
  },
});
