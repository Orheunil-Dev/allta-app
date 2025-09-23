import { blackDownArrow } from "@/assets/images";
import { CustomText } from "@/components/ui/CustomText";
import { passTypes, storeTags } from "@/constants";
import { colors } from "@/styles";
import { PassType, ServiceType } from "@/types";
import { formatEllipsis, formatPassType, getResponsiveSize } from "@/utils";
import { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  serviceType: ServiceType;
  setServiceType: React.Dispatch<React.SetStateAction<ServiceType>>;
  passType: PassType | null;
  setPassType: React.Dispatch<React.SetStateAction<PassType | null>>;
  coordinate: {
    id: string | null;
    nickname: string | null;
    lat: number;
    lng: number;
  };
}

const { width: screenWidth } = Dimensions.get("window");

export const MyStoreFilter = ({
  serviceType,
  setServiceType,
  passType,
  setPassType,
  coordinate,
}: Props) => {
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const handleServiceType = (value: ServiceType) => () => {
    return setServiceType(value);
  };

  const handlePassType = (value: PassType | null) => () => {
    if (passType === value) {
      setPassType(null);
    } else {
      setPassType(value);
    }
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
          <Pressable
            onPress={handlePassType(null)}
            style={[
              styles.filterButton,
              passType === null && {
                backgroundColor: colors.main,
              },
            ]}
          >
            <CustomText
              color={passType === null ? colors.white : colors.black}
              fontSize={14}
            >
              전체
            </CustomText>
          </Pressable>
          {passTypes.map((value, index) => (
            <Pressable
              key={index}
              onPress={handlePassType(value as PassType)}
              style={[
                styles.filterButton,
                passType === value && {
                  backgroundColor: colors.main,
                },
              ]}
            >
              <CustomText
                color={passType === value ? colors.white : colors.black}
                fontSize={14}
              >
                {formatPassType(value)}
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
    width: "100%",
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
