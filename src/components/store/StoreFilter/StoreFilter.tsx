import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { PassType, ServiceType } from "@/types";
import { getResponsiveSize } from "@/utils";
import { Pressable, StyleSheet, View } from "react-native";

interface Props {
  serviceType: ServiceType;
  setServiceType: (value: React.SetStateAction<ServiceType>) => void;
  passType: PassType | undefined;
  setPassType: (value: React.SetStateAction<PassType | undefined>) => void;
}

export const StoreFilter = ({
  serviceType,
  setServiceType,
  passType,
  setPassType,
}: Props) => {
  const handleServiceType = (value: ServiceType) => () => {
    return setServiceType(value);
  };

  const handlePassType = (value: PassType) => () => {
    if (value === passType) {
      return setPassType(undefined);
    }

    return setPassType(value);
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

      <View style={styles.filter}>
        <Pressable style={styles.filterButton}>
          <CustomText fontSize={14}>현위치</CustomText>
        </Pressable>

        <Pressable
          onPress={handlePassType("PREMIUM")}
          style={[
            styles.filterButton,
            passType === "PREMIUM" && {
              backgroundColor: colors.main,
            },
          ]}
        >
          <CustomText
            color={passType === "PREMIUM" ? colors.white : colors.black}
            fontSize={14}
          >
            프리미엄
          </CustomText>
        </Pressable>

        <Pressable
          onPress={handlePassType("STANDARD")}
          style={[
            styles.filterButton,
            passType === "STANDARD" && {
              backgroundColor: colors.main,
            },
          ]}
        >
          <CustomText
            color={passType === "STANDARD" ? colors.white : colors.black}
            fontSize={14}
          >
            스탠다드
          </CustomText>
        </Pressable>

        <Pressable
          onPress={handlePassType("TICKET")}
          style={[
            styles.filterButton,
            passType === "TICKET" && {
              backgroundColor: colors.main,
            },
          ]}
        >
          <CustomText
            color={passType === "TICKET" ? colors.white : colors.black}
            fontSize={14}
          >
            일회권
          </CustomText>
        </Pressable>
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
  filter: {
    flexDirection: "row",
    alignItems: "center",
    height: getResponsiveSize(58),
    paddingHorizontal: getResponsiveSize(20),
    gap: getResponsiveSize(8),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  filterButton: {
    paddingVertical: getResponsiveSize(6),
    paddingHorizontal: getResponsiveSize(14),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
