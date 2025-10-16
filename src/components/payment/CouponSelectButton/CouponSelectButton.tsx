import { blackRightArrow } from "@/assets/images";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "@/styles";
import { Coupon } from "@/types";
import { useCouponControllerGetAvailableCouponList } from "@/api/coupon/coupon";
import { CouponListBottomSheet } from "@/components/bottom-sheet/CouponListBottomSheet";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  coupon: Coupon | null;
  setCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  storeId: string;
  serviceType: string;
  passType: string;
}

export const CouponSelectButton = ({
  coupon,
  setCoupon,
  storeId,
  serviceType,
  passType,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 사용 가능 쿠폰 목록 조회
  const { data: couponData, refetch: couponRefetch } =
    useCouponControllerGetAvailableCouponList(
      {
        storeId,
        serviceType,
        passType,
      },
      {
        query: {
          queryKey: ["available-coupons"],
          retry: false,
          gcTime: 0,
        },
      }
    );

  const handleOpenBottomSheet = () => {
    setSelectedCoupon(coupon);

    return bottomSheetRef.current?.present();
  };

  useEffect(() => {
    if (couponData?.data) {
      setCoupon(couponData.data[0]);
    }
  }, [couponData?.data]);

  useEffect(() => {
    setSelectedCoupon(coupon);
  }, [coupon]);

  return (
    <View style={{ marginTop: getResponsiveSize(40) }}>
      <CouponListBottomSheet
        ref={bottomSheetRef}
        couponData={couponData}
        coupon={coupon}
        setCoupon={setCoupon}
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
      />

      <CustomText fontSize={18} fontWeight={"600"}>
        쿠폰
      </CustomText>

      <CustomButton
        onPress={handleOpenBottomSheet}
        height={getResponsiveSize(48)}
        marginTop={12}
        borderWidth={1}
        borderColor={colors.line}
      >
        <View style={styles.button}>
          <CustomText fontSize={15} fontWeight={"500"}>
            {!couponData || !couponData.data.length
              ? "사용 가능한 쿠폰이 없습니다."
              : coupon
              ? coupon.name
              : `사용 가능한 쿠폰이 ${couponData.data.length}개 있어요`}
          </CustomText>
          <Image
            source={blackRightArrow}
            style={{
              width: getResponsiveSize(24),
              height: getResponsiveSize(24),
            }}
          />
        </View>
      </CustomButton>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: getResponsiveSize(8),
    paddingLeft: getResponsiveSize(12),
  },
});
