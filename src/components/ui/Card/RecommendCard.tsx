import { Image, Pressable, StyleSheet, View } from "react-native";
import { CustomText } from "../CustomText";
import { defaultStoreImage, homeDistanceIcon } from "@/assets/images";
import { colors } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import { StoreDetailItemPassPrice } from "@/types";

interface Props {
  id: string;
  name: string;
  distance: string;
  address: string;
  passPrice?: StoreDetailItemPassPrice | null;
  mainImage?: string | null;
  storeGroupId?: string | null;
}

export const RecommendCard = ({
  id,
  name,
  distance,
  address,
  passPrice,
  mainImage,
  storeGroupId,
}: Props) => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const handleRouteStoreDetail = () => {
    if (!passPrice) return;

    const serviceType = passPrice?.AUTO
      ? "AUTO"
      : passPrice?.HANDS
      ? "HANDS"
      : "AUTO";

    return containerNavigation.navigate("StoreStack", {
      screen: "StoreDetail",
      params: {
        serviceType,
        storeId: id,
        storeName: name,
        storeGroupId: storeGroupId ?? undefined,
      },
    });
  };

  return (
    <Pressable onPress={handleRouteStoreDetail} style={styles.container}>
      <Image src={mainImage ?? defaultStoreImage} style={styles.storeImage} />

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
