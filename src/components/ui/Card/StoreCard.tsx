import { defaultStoreImage, locationIcon } from "@/assets/images";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { CustomText } from "../CustomText";
import { formatEllipsis, getResponsiveSize } from "@/utils";
import { StoreListItem } from "@/api/models";
import { PassPrice, ServiceType } from "@/types";
import { useDistanceCalculator } from "@/hooks";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StoreStackParamList } from "@/navigations";
import { colors } from "@/styles";

type StoreServiceType = {
  AUTO?: PassPrice;
  HANDS?: PassPrice;
};

interface Props {
  store: StoreListItem;
  serviceType: ServiceType;
  lat?: number;
  lng?: number;
}

export const StoreCard = ({
  store,
  serviceType,
  lat = 37.5759785,
  lng = 127.1935115,
}: Props) => {
  const storeNavigation =
    useNavigation<NativeStackNavigationProp<StoreStackParamList>>();

  const { getDistance } = useDistanceCalculator();

  // 이용권 가격 표시
  const getLowestPrice = (priceObject: StoreServiceType): number | null => {
    const service = priceObject[serviceType];
    if (!service) return null;

    let minPrice: number | null = null;

    const prices = Object.values(service);

    prices.forEach((carType) => {
      if (!carType) return;

      Object.values(carType).forEach((price) => {
        if (minPrice === null || price < minPrice) {
          minPrice = price;
        }
      });
    });

    return minPrice;
  };

  return (
    <Pressable
      onPress={() => {
        storeNavigation.navigate("StoreDetail", {
          serviceType,
          storeId: store.id,
          storeName: store.name,
          ...(store.storeGroupId && { storeGroupId: store.storeGroupId }),
        });
      }}
      style={styles.card}
    >
      <View style={styles.top}>
        <ImageBackground
          source={
            store?.mainImage ? { uri: store.mainImage } : defaultStoreImage
          }
          style={styles.storeImage}
        ></ImageBackground>

        <View style={{ flex: 1 }}>
          <CustomText fontSize={18} fontWeight={"600"}>
            {formatEllipsis(store.name, 14)}
          </CustomText>

          <View style={styles.address}>
            <Image
              source={locationIcon}
              style={{
                width: getResponsiveSize(16),
                height: getResponsiveSize(16),
                marginRight: getResponsiveSize(2),
              }}
            />

            <CustomText color={colors.gray7} fontSize={14}>
              {getDistance(lat, lng, store.lat, store.lng)}
              km
            </CustomText>

            <View style={styles.divider} />

            <CustomText color={colors.gray7} fontSize={14}>
              {formatEllipsis(store.address, 13)}
            </CustomText>
          </View>
        </View>
      </View>

      <View style={styles.tagArea}>
        {store.tags &&
          store.tags
            .trim()
            .split(",")
            .map((value, index) => (
              <View style={styles.tag} key={index}>
                <CustomText
                  color={colors.back1}
                  fontSize={10}
                  fontWeight={"500"}
                >
                  {value.trim()}
                </CustomText>
              </View>
            ))}
      </View>

      <View style={styles.bottom}>
        <View>
          {(store.groupStoresCount ?? 0) > 1 && (
            <View style={styles.groupCount}>
              <CustomText color={colors.gray7} fontSize={12} fontWeight={"500"}>
                매장 {store.groupStoresCount! - 1}곳 포함
              </CustomText>
            </View>
          )}
        </View>

        {store.passPrice && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CustomText color={colors.gray7} fontSize={14} numberOfLines={1}>
              이용권 최저가
            </CustomText>

            <CustomText marginLeft={8} fontSize={18} fontWeight={"600"}>
              {getLowestPrice(
                store.passPrice && typeof store.passPrice === "string"
                  ? JSON.parse(store.passPrice)
                  : store.passPrice
              )?.toLocaleString()}
              원 ~
            </CustomText>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: getResponsiveSize(16),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: getResponsiveSize(12),
  },
  storeImage: {
    width: getResponsiveSize(76),
    height: getResponsiveSize(76),
    marginRight: getResponsiveSize(12),
    borderRadius: 12,
    overflow: "hidden",
  },
  divider: {
    width: 1,
    height: getResponsiveSize(12),
    marginHorizontal: getResponsiveSize(6),
    backgroundColor: colors.gray2,
  },
  address: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(4),
  },
  tagArea: {
    flexDirection: "row",
    marginBottom: getResponsiveSize(10),
    gap: getResponsiveSize(6),
  },
  tag: {
    paddingVertical: getResponsiveSize(3),
    paddingHorizontal: getResponsiveSize(6),
    backgroundColor: colors.back4,
    borderRadius: 4,
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: getResponsiveSize(12),
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  groupCount: {
    justifyContent: "center",
    paddingVertical: getResponsiveSize(6),
    paddingHorizontal: getResponsiveSize(10),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
  },
});
