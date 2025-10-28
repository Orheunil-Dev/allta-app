import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSetAtom } from "jotai";
import dayjs from "dayjs";
import {
  useCouponControllerGetCouponList,
  useCouponControllerRegisterCouponCode,
} from "@/api/coupon/coupon";
import { GetCouponListResponse } from "@/api/models";
import { errorModalAtom } from "@/jotai";
import { useToastMessage } from "@/hooks";
import {
  formatCouponPassType,
  formatCouponValue,
  getFontSize,
  getResponsiveSize,
} from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomButton } from "@/components/ui/CustomButton";
import { colors, fontMap } from "@/styles";

export const Coupon = () => {
  const setErrorModal = useSetAtom(errorModalAtom);

  const [skip, setSkip] = useState<number>(0);
  const [coupons, setCoupons] = useState<GetCouponListResponse["data"]>([]);
  const [code, setCode] = useState<string>("");

  const { SuccessToast, ErrorToast } = useToastMessage();

  // 쿠폰 목록 조회 API
  const {
    data: couponData,
    isLoading: couponLoading,
    refetch: couponRefetch,
  } = useCouponControllerGetCouponList(
    {
      take: 20,
      skip,
    },
    {
      query: {
        queryKey: ["coupons"],
        retry: false,
        gcTime: 0,
      },
    }
  );

  // 쿠폰 등록 API
  const {
    mutate: registerCode,
    isPending: registerCodeLoading,
    isError: registerCodeError,
  } = useCouponControllerRegisterCouponCode();

  // 쿠폰 등록
  const handleSubmit = () => {
    if (!code.trim()) return ErrorToast("코드를 입력해주세요.");

    registerCode(
      {
        data: { code },
      },
      {
        onSuccess: () => {
          setSkip(0);
          setCoupons([]);
          setCode("");
          SuccessToast("쿠폰이 등록되었습니다.");
          couponRefetch();
        },
        onError: (error) => {
          const errorMessage =
            (error as { message?: string })?.message ?? String(error) ?? "";

          setErrorModal({
            visible: true,
            message: errorMessage,
          });
        },
      }
    );
  };

  // 무한 스크롤
  useEffect(() => {
    if (couponData?.data) {
      setCoupons((prev) => [...prev, ...couponData.data]);
    }
  }, [couponData]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
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
          maxLength={30}
          underlineColorAndroid="transparent"
          style={styles.codeInput}
        />
        <CustomButton
          onPress={handleSubmit}
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

      {!couponLoading &&
        (coupons.length > 0 ? (
          <FlatList
            data={coupons}
            keyExtractor={(item) => item.id}
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}
            renderItem={({ item, index }) => (
              <View style={styles.card}>
                <CustomText
                  color={colors.point2}
                  fontSize={20}
                  fontWeight={"600"}
                >
                  {formatCouponValue(item.discountType, item.discountValue)}
                </CustomText>

                <CustomText marginTop={6} fontSize={16} fontWeight={"600"}>
                  {item.name}
                </CustomText>

                <View style={styles.row}>
                  <CustomText color={colors.gray6} fontSize={13}>
                    {formatCouponPassType(
                      item.serviceType ?? null,
                      item.passType ?? null
                    )}{" "}
                    구매시
                  </CustomText>
                </View>

                <View style={styles.row}>
                  <CustomText color={colors.gray6} fontSize={13}>
                    {dayjs(item.expiredAt).format("YYYY.MM.DD")} 까지
                  </CustomText>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyBox}>
            <CustomText color={colors.gray5} fontSize={20} fontWeight={"600"}>
              사용 가능한 쿠폰이 없습니다.
            </CustomText>
          </View>
        ))}
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveSize(20),
    gap: getResponsiveSize(16),
  },
  codeArea: {
    flexDirection: "row",
    padding: getResponsiveSize(20),
    gap: getResponsiveSize(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  codeInput: {
    flex: 1,
    fontFamily: fontMap["500"],
    fontSize: getFontSize(15),
    fontWeight: "500",
    paddingHorizontal: getResponsiveSize(12),
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 12,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSize(1),
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: getResponsiveSize(60),
  },
});
