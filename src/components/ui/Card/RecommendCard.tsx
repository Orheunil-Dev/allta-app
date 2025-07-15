import { Image, Pressable, StyleSheet, View } from "react-native";
import { CustomText } from "../CustomText";
import { homeDistanceIcon } from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  name: string;
  distance: number;
  address: string;
  image: string;
}

export const RecommendCard = ({ name, distance, address, image }: Props) => {
  return (
    <Pressable style={styles.container}>
      <Image src={image} style={styles.storeImage} />

      <View>
        <CustomText fontSize={16} fontWeight={"600"}>
          {name}
        </CustomText>

        <View style={styles.distance}>
          <Image source={homeDistanceIcon} style={styles.distanceIcon} />
          <CustomText color={colors.gray5} fontSize={13}>
            {distance}km
          </CustomText>
        </View>

        <CustomText color={colors.gray5} fontSize={13} marginTop={1}>
          {address}
        </CustomText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderColor: colors.gray2,
    borderWidth: 1,
  },
  storeImage: {
    width: 76,
    height: 76,
    marginRight: 12,
    borderRadius: 12,
  },
  distance: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  distanceIcon: {
    width: 16,
    height: 16,
    marginRight: 2,
  },
});
