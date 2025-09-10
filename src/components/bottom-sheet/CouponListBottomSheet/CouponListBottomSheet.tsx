import { GetCouponListResponse } from "@/api/models";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { checkedRadioIcon, uncheckedRadioIcon } from "@/assets/images";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { Car, Coupon } from "@/types";
import { formatCouponValue, getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  coupon: Coupon | null;
  setCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  couponData: GetCouponListResponse | undefined;
}

export const CouponListBottomSheet = ({
  ref,
  coupon,
  setCoupon,
  couponData,
}: Props) => {
  const handleSelectCoupon = (value: Coupon) => () => {
    if (coupon?.id === value.id) {
      return setCoupon(null);
    }

    return setCoupon(value);
  };

  const handleClose = () => {
    return ref?.current?.close();
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(500)}
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
                  item.id === coupon?.id && {
                    borderWidth: 2,
                    borderColor: colors.point2,
                  },
                ]}
              >
                <Image
                  source={
                    coupon?.id === item.id
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

                <CustomText fontSize={16} fontWeight={"600"}>
                  {item.name}
                </CustomText>

                {item.expiredAt && (
                  <CustomText marginTop={8} color={colors.gray7} fontSize={14}>
                    {dayjs(item.expiredAt)
                      .tz("Asia/Seoul")
                      .format("YYYY. MM. DD 까지")}
                  </CustomText>
                )}
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
    borderRadius: 8,
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
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
