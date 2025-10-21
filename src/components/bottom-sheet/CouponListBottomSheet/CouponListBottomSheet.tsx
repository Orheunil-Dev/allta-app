import { useEffect } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import { GetAvailableCouponListResponse } from "@/api/models";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { formatCouponValue, getFontSize, getResponsiveSize } from "@/utils";
import { Coupon } from "@/types";
import { checkedRadioIcon, uncheckedRadioIcon } from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  couponData: GetAvailableCouponListResponse | undefined;
  coupon: Coupon | null;
  setCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
}

export const CouponListBottomSheet = ({
  ref,
  couponData,
  coupon,
  setCoupon,
  selectedCoupon,
  setSelectedCoupon,
}: Props) => {
  // 쿠폰 선택
  const handleSelectCoupon = (value: Coupon) => () => {
    if (selectedCoupon?.id === value.id) {
      return setSelectedCoupon(null);
    }

    return setSelectedCoupon(value);
  };

  // 쿠폰 적용
  const handleApply = () => {
    setCoupon(selectedCoupon);

    return ref?.current?.close();
  };

  const handleClose = () => {
    setSelectedCoupon(coupon);

    return ref?.current?.close();
  };

  useEffect(() => {
    setSelectedCoupon(coupon);
  }, [coupon]);

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(650)}
      title="쿠폰 선택"
      onClose={handleClose}
      hasCloseButton
    >
      <View style={styles.container}>
        {couponData?.data.length ? (
          <FlatList
            data={couponData?.data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: getResponsiveSize(16) }}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={handleSelectCoupon(item)}
                style={[
                  styles.card,
                  item.id === selectedCoupon?.id && {
                    borderWidth: 2,
                    borderColor: colors.point2,
                  },
                ]}
              >
                <Image
                  source={
                    selectedCoupon?.id === item.id
                      ? checkedRadioIcon
                      : uncheckedRadioIcon
                  }
                  style={styles.radioButton}
                />

                <CustomText
                  color={colors.point2}
                  fontSize={20}
                  fontWeight={"600"}
                >
                  {formatCouponValue(item.discountType, item.discountValue)}
                </CustomText>

                <CustomText marginTop={6} fontSize={14} fontWeight={"600"}>
                  {item.name}
                </CustomText>

                <View style={styles.row}>
                  <CustomText color={colors.gray6} fontSize={13}>
                    {dayjs(item.expiredAt).format("YYYY.MM.DD")} 까지
                  </CustomText>
                </View>
              </Pressable>
            )}
          />
        ) : (
          <View style={styles.emptyBox}>
            <CustomText
              marginBottom={4}
              color={colors.gray5}
              fontSize={20}
              fontWeight={"600"}
            >
              사용 가능한 쿠폰이 없습니다
            </CustomText>
          </View>
        )}
      </View>

      <CustomButton
        onPress={handleApply}
        width={"100%"}
        height={getResponsiveSize(53)}
        marginTop={20}
        backgroundColor={colors.main}
      >
        <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
          쿠폰 적용하기
        </CustomText>
      </CustomButton>
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  card: {
    position: "relative",
    padding: getResponsiveSize(16),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  radioButton: {
    position: "absolute",
    top: getResponsiveSize(16),
    right: getResponsiveSize(16),
    width: getResponsiveSize(20),
    height: getResponsiveSize(20),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(1),
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
