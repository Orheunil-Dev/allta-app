import { blackRightArrow } from "@/assets/images";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "@/styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ContainerStackParamList } from "@/navigations";
import { Coupon } from "@/types";
import { useCouponControllerGetCouponList } from "@/api/coupon/coupon";
import { CouponListBottomSheet } from "@/components/bottom-sheet/CouponListBottomSheet";

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
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { data: couponData, refetch: couponRefetch } =
    useCouponControllerGetCouponList(
      {
        storeId,
        serviceType,
        passType,
      },
      {
        query: {
          queryKey: ["coupon"],
          retry: false,
          gcTime: 0,
        },
      }
    );

  useEffect(() => {
    if (couponData?.data) {
      setCoupon(couponData.data[0]);
    }
  }, [couponData?.data]);

  return (
    <View style={{ marginTop: getResponsiveSize(40) }}>
      <CouponListBottomSheet
        ref={bottomSheetRef}
        coupon={coupon}
        setCoupon={setCoupon}
        couponData={couponData}
      />

      <CustomText fontSize={18} fontWeight={"600"}>
        쿠폰
      </CustomText>

      <CustomButton
        onPress={() => bottomSheetRef.current?.present()}
        height={getResponsiveSize(48)}
        marginTop={12}
        borderWidth={1}
        borderColor={colors.line}
      >
        <View style={styles.button}>
          <CustomText fontSize={15} fontWeight={"500"}>
            {coupon ? coupon.discountValue : "사용 가능한 쿠폰이 없습니다."}
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
