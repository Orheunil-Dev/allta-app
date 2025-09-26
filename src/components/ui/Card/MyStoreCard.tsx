import { defaultStoreImage, locationIcon } from "@/assets/images";
import {
  Image,
  ImageBackground,
  Linking,
  StyleSheet,
  View,
} from "react-native";
import { CustomText } from "../CustomText";
import { formatEllipsis, formatPassType, getResponsiveSize } from "@/utils";
import { MyStoreListItem } from "@/api/models";
import { useDistanceCalculator } from "@/hooks";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MyStoreStackParamList, StoreStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { CustomButton } from "../CustomButton";

interface Props {
  store: MyStoreListItem;
  lat?: number;
  lng?: number;
}

export const MyStoreCard = ({
  store,
  lat = 37.5759785,
  lng = 127.1935115,
}: Props) => {
  const myStoreNavigation =
    useNavigation<NativeStackNavigationProp<MyStoreStackParamList>>();

  const { getDistance } = useDistanceCalculator();

  const handleOpenNavigation = () => {
    const destination = encodeURIComponent(store.name);
    const tmapScheme = `tmap://?rGoName=${destination}&rGoX=${store.lng}&rGoY=${store.lat}`;

    return Linking.openURL(tmapScheme);
  };

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <ImageBackground
          source={
            store?.mainImage ? { uri: store.mainImage } : defaultStoreImage
          }
          style={styles.storeImage}
        ></ImageBackground>

        <View>
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
              {formatEllipsis(store.address, 12)}
            </CustomText>
          </View>

          <View style={styles.passTypes}>
            {store.passTypes
              .trim()
              .split(",")
              .map((value, index) => (
                <View style={styles.tag} key={index}>
                  <CustomText
                    color={colors.back1}
                    fontSize={10}
                    fontWeight={"500"}
                  >
                    {formatPassType(value.trim())}
                  </CustomText>
                </View>
              ))}
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <CustomButton
          onPress={() =>
            myStoreNavigation.navigate("MyStoreDetail", {
              storeId: store.id,
              storeName: store.name,
            })
          }
          flex={1}
          height={getResponsiveSize(34)}
          borderWidth={1}
          borderColor={colors.gray2}
        >
          <CustomText fontSize={13} fontWeight={"500"}>
            매장 정보
          </CustomText>
        </CustomButton>

        <CustomButton
          onPress={handleOpenNavigation}
          flex={1}
          height={getResponsiveSize(34)}
          backgroundColor={colors.point2}
        >
          <CustomText color={colors.white} fontSize={13} fontWeight={"500"}>
            길찾기
          </CustomText>
        </CustomButton>
      </View>
    </View>
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
    width: getResponsiveSize(86),
    height: getResponsiveSize(86),
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
  passTypes: {
    flexDirection: "row",
    marginTop: getResponsiveSize(4),
    gap: getResponsiveSize(6),
  },
  tag: {
    paddingVertical: getResponsiveSize(3),
    paddingHorizontal: getResponsiveSize(6),
    backgroundColor: colors.back4,
    borderRadius: 4,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: getResponsiveSize(16),
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
