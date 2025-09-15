import { GetCouponListResponse } from "@/api/models";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { checkedRadioIcon, uncheckedRadioIcon } from "@/assets/images";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { Coupon } from "@/types";
import { formatCouponValue, getFontSize, getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Image, Pressable, StyleSheet, View, TextInput } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  couponData: GetCouponListResponse | undefined;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  coupon: Coupon | null;
  setCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: React.Dispatch<React.SetStateAction<Coupon | null>>;
  onSubmit: () => void;
}

export const CouponListBottomSheet = ({
  ref,
  couponData,
  code,
  setCode,
  coupon,
  setCoupon,
  selectedCoupon,
  setSelectedCoupon,
  onSubmit,
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
        <View style={styles.codeArea}>
          <TextInput
            defaultValue={code}
            onChangeText={(text) => {
              setCode(text);
            }}
            keyboardType="default"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="쿠폰번호 입력"
            style={styles.codeInput}
          />
          <CustomButton
            onPress={onSubmit}
            width={getResponsiveSize(74)}
            height={getResponsiveSize(45)}
            borderWidth={1}
            borderColor={colors.gray2}
          >
            <CustomText fontSize={15} fontWeight={"500"}>
              쿠폰등록
            </CustomText>
          </CustomButton>
        </View>

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

                <CustomText fontSize={20} fontWeight={"600"}>
                  {item.name}
                </CustomText>

                {item.expiredAt && (
                  <CustomText marginTop={4} color={colors.gray7} fontSize={14}>
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
  codeArea: {
    flexDirection: "row",
    marginBottom: getResponsiveSize(24),
    gap: getResponsiveSize(12),
  },
  codeInput: {
    flex: 1,
    fontSize: getFontSize(15),
    fontWeight: "500",
    paddingHorizontal: getResponsiveSize(12),
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
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
