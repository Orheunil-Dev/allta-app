import { blackDownArrow } from "@/assets/images";
import { CustomText } from "@/components/ui/CustomText";
import { storeTags } from "@/constants";
import { colors } from "@/styles";
import { ServiceType } from "@/types";
import { formatEllipsis, getResponsiveSize } from "@/utils";
import { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  serviceType: ServiceType;
  setServiceType: React.Dispatch<React.SetStateAction<ServiceType>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  coordinate: {
    id: string | null;
    nickname: string | null;
    lat: number;
    lng: number;
  };
  handleOpenAddressModal: () => void;
}

const { width: screenWidth } = Dimensions.get("window");

export const StoreFilter = ({
  serviceType,
  setServiceType,
  tags,
  setTags,
  coordinate,
  handleOpenAddressModal,
}: Props) => {
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const handleServiceType = (value: ServiceType) => () => {
    return setServiceType(value);
  };

  const handleTags = (value: string) => () => {
    setTags((prev) =>
      prev.includes(value)
        ? prev.filter((tag) => tag !== value)
        : [...prev, value]
    );
  };

  return (
    <View>
      <View style={styles.serviceType}>
        <Pressable
          onPress={handleServiceType("AUTO")}
          style={[
            styles.serviceButton,
            serviceType === "AUTO" && {
              borderBottomColor: colors.black,
              borderBottomWidth: 2,
            },
          ]}
        >
          <CustomText
            color={serviceType === "AUTO" ? colors.black : colors.gray5}
            fontSize={16}
            fontWeight={serviceType === "AUTO" ? "600" : "500"}
          >
            자동세차
          </CustomText>
        </Pressable>
        <Pressable
          onPress={handleServiceType("HANDS")}
          style={[
            styles.serviceButton,
            serviceType === "HANDS" && {
              borderBottomColor: colors.black,
              borderBottomWidth: 2,
            },
          ]}
        >
          <CustomText
            color={serviceType === "HANDS" ? colors.black : colors.gray5}
            fontSize={16}
            fontWeight={serviceType === "HANDS" ? "600" : "500"}
          >
            핸즈클리닝
          </CustomText>
        </Pressable>
      </View>

      <View style={styles.filterWrapper}>
        <Pressable onPress={handleOpenAddressModal} style={styles.filterButton}>
          <CustomText marginRight={4} fontSize={14}>
            {coordinate.id
              ? formatEllipsis(coordinate.nickname as string, 6)
              : "현위치"}
          </CustomText>
          <Image
            source={blackDownArrow}
            style={{
              width: getResponsiveSize(8),
              height: getResponsiveSize(4),
            }}
          />
        </Pressable>

        <ScrollView
          horizontal
          scrollEnabled={scrollEnabled}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={(contentWidth) => {
            setScrollEnabled(
              contentWidth > screenWidth - getResponsiveSize(40)
            );
          }}
          contentContainerStyle={styles.filter}
        >
          {storeTags.map((value, index) => (
            <Pressable
              key={index}
              onPress={handleTags(value)}
              style={[
                styles.filterButton,
                tags.includes(value) && {
                  backgroundColor: colors.main,
                  borderColor: colors.main,
                },
              ]}
            >
              <CustomText
                color={tags.includes(value) ? colors.white : colors.black}
                fontSize={14}
              >
                {value}
              </CustomText>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceType: {
    flexDirection: "row",
    height: getResponsiveSize(52),
    backgroundColor: colors.white,
  },
  serviceButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  filterWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: getResponsiveSize(58),
    paddingHorizontal: getResponsiveSize(20),
    gap: getResponsiveSize(8),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    gap: getResponsiveSize(8),
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: getResponsiveSize(6),
    paddingHorizontal: getResponsiveSize(14),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
