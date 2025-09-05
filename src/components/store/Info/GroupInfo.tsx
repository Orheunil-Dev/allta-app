import { GetStoreGroupListResponse } from "@/api/models";
import { defaultStoreImage, locationIcon } from "@/assets/images";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { getResponsiveSize } from "@/utils";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

interface Props {
  group: GetStoreGroupListResponse["data"];
  coordinate: {
    lat: number;
    lng: number;
  };
  getDistance: (
    currentLat: number,
    currentLng: number,
    storeLat: number,
    storeLng: number
  ) => string;
}

export const GroupInfo = ({ group, coordinate, getDistance }: Props) => {
  return (
    <View style={styles.container}>
      {group.map((value, index) => (
        <View key={value.id} style={styles.card}>
          <ImageBackground
            source={
              value?.mainImage ? { uri: value.mainImage } : defaultStoreImage
            }
            style={styles.storeImage}
          ></ImageBackground>

          <View>
            <CustomText fontSize={16} fontWeight={"600"}>
              {value.name}
            </CustomText>

            <CustomText marginTop={2} color={colors.gray7} fontSize={14}>
              {value.address}
            </CustomText>

            <View style={styles.distance}>
              <Image
                source={locationIcon}
                style={{
                  width: getResponsiveSize(16),
                  height: getResponsiveSize(16),
                  marginRight: getResponsiveSize(4),
                }}
              />
              <CustomText color={colors.gray7} fontSize={14}>
                {getDistance(
                  coordinate?.lat,
                  coordinate?.lng,
                  value.lat as number,
                  value.lng as number
                )}
                km
              </CustomText>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveSize(20),
    gap: getResponsiveSize(16),
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: getResponsiveSize(12),
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
  storeImage: {
    width: getResponsiveSize(68),
    height: getResponsiveSize(68),
    marginRight: getResponsiveSize(12),
    borderRadius: 12,
    overflow: "hidden",
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
  },
});
