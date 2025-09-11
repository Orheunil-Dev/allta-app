import {
  blackRightArrow,
  checkAllButton,
  checkedCheckAllButton,
  defaultStoreImage,
  rigthArrowIcon,
} from "@/assets/images";
import { PaymentTermsBottomSheet } from "@/components/bottom-sheet/PaymentTermsBottomSheet";
import { BottomButtonArea } from "@/components/layout/BottomButtonArea";
import { CardSelectButton } from "@/components/payment/CardSelectButton";
import { CarSelectButton } from "@/components/payment/CarSelectButton";
import { CouponSelectButton } from "@/components/payment/CouponSelectButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { PaymentStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { Car, CarType, Coupon } from "@/types";
import { formatPurchaseType, getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type PaymentRouteProp = RouteProp<PaymentStackParamList, "Payment">;

export const Payment = () => {
  const router = useRoute<PaymentRouteProp>();

  const termsBottomSheetRef = useRef<BottomSheetModal>(null);

  const [paymentForm, setPaymentForm] = useState({});
  const [price, setPrice] = useState<number>(0);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [card, setCard] = useState(null);
  const [agree, setAgree] = useState<boolean>(false);

  const paymentNavigation =
    useNavigation<NativeStackNavigationProp<PaymentStackParamList>>();

  const handlePayment = () => {
    return paymentNavigation.navigate("PaymentComplete");
  };

  const getDiscountAmount = (type?: string, value?: number) => {
    if (!price || !type || !value) return 0;

    switch (type) {
      case "RATE":
        return price * (value / 100);

      case "PRICE":
        return value;

      case "FIXED":
        return Math.max(0, price - value);

      default:
        return 0;
    }
  };

  const isValid = !!agree && !!car;

  useEffect(() => {
    const carTypeKey: CarType = (car?.type as CarType) ?? "SEDAN";

    return setPrice(router.params.price[carTypeKey]);
  }, [car, router.params]);

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <PaymentTermsBottomSheet ref={termsBottomSheetRef} />

      <ScrollView style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ImageBackground
            source={
              router.params.storeImage
                ? { uri: router.params.storeImage }
                : defaultStoreImage
            }
            style={styles.storeImage}
          ></ImageBackground>

          <View>
            <CustomText fontSize={16} fontWeight={"600"}>
              {formatPurchaseType(router.params.passType)}
            </CustomText>
            <CustomText fontSize={14}>{router.params.storeName}</CustomText>
          </View>
        </View>

        <View style={styles.priceBox}>
          <View style={styles.price}>
            <CustomText fontSize={14}>이용권 금액</CustomText>
            <CustomText fontSize={14} fontWeight={"600"}>
              {(price ?? 0).toLocaleString()}원
            </CustomText>
          </View>
          <View style={styles.dicount}>
            <CustomText fontSize={14}>쿠폰 할인</CustomText>
            <CustomText fontSize={14} fontWeight={"600"}>
              -{" "}
              {getDiscountAmount(
                coupon?.discountType,
                coupon?.discountValue
              ).toLocaleString()}
              원
            </CustomText>
          </View>
        </View>

        {/* 쿠폰 선택 */}
        <CouponSelectButton
          coupon={coupon}
          setCoupon={setCoupon}
          storeId={router.params.storeId}
          serviceType={router.params.serviceType}
          passType={router.params.passType}
        />

        {/* 차량 선택 */}
        <CarSelectButton car={car} setCar={setCar} />

        {/* 카드 선택 */}
        <CardSelectButton />

        <CustomText marginTop={40} fontSize={18} fontWeight={"600"}>
          결제 금액
        </CustomText>

        <View style={{ marginTop: getResponsiveSize(12) }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <CustomText fontSize={16}>이용권 금액</CustomText>
            <CustomText fontSize={16}>
              {router.params.price["SEDAN"].toLocaleString()}원
            </CustomText>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: getResponsiveSize(6),
            }}
          >
            <CustomText fontSize={16}>쿠폰 할인</CustomText>
            <CustomText color={colors.point2} fontSize={16}>
              -{" "}
              {getDiscountAmount(
                coupon?.discountType,
                coupon?.discountValue
              ).toLocaleString()}
              원
            </CustomText>
          </View>
        </View>

        <View style={styles.totalAmount}>
          <CustomText fontSize={18} fontWeight={"600"}>
            최종 결제 금액
          </CustomText>
          <CustomText color={colors.point2} fontSize={18} fontWeight={"600"}>
            {(
              (price ?? 0) -
              getDiscountAmount(coupon?.discountType, coupon?.discountValue)
            ).toLocaleString()}
            원
          </CustomText>
        </View>

        <View style={styles.terms}>
          <CustomButton
            onPress={() => setAgree(!agree)}
            height={getResponsiveSize(48)}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={agree ? checkedCheckAllButton : checkAllButton}
                style={styles.check}
              />
              <CustomText fontSize={16} fontWeight={"500"}>
                주문 내용 확인 및 결제 동의
              </CustomText>
            </View>
          </CustomButton>

          <CustomButton
            onPress={() => termsBottomSheetRef.current?.present()}
            height={getResponsiveSize(48)}
          >
            <Image
              source={rigthArrowIcon}
              style={{
                width: getResponsiveSize(24),
                height: getResponsiveSize(24),
              }}
            />
          </CustomButton>
        </View>
      </ScrollView>
      <BottomButtonArea>
        <CustomButton
          isDisabled={isValid}
          onPress={handlePayment}
          width={"100%"}
          height={getResponsiveSize(53)}
          backgroundColor={agree ? colors.point2 : colors.gray2}
        >
          <CustomText
            color={agree ? colors.white : colors.gray5}
            fontSize={18}
            fontWeight={"600"}
          >
            결제하기
          </CustomText>
        </CustomButton>
      </BottomButtonArea>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: getResponsiveSize(20),
  },
  storeImage: {
    width: getResponsiveSize(56),
    height: getResponsiveSize(56),
    marginRight: getResponsiveSize(12),
    borderRadius: 12,
    overflow: "hidden",
  },
  priceBox: {
    marginTop: getResponsiveSize(12),
    padding: getResponsiveSize(8),
    backgroundColor: colors.gray1,
    borderRadius: 8,
  },
  price: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dicount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: getResponsiveSize(8),
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingRight: getResponsiveSize(8),
    paddingLeft: getResponsiveSize(12),
  },
  totalAmount: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: getResponsiveSize(12),
    paddingTop: getResponsiveSize(12),
    borderTopWidth: 1,
    borderTopColor: colors.gray1,
  },
  terms: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: getResponsiveSize(40),
    marginBottom: getResponsiveSize(66),
    paddingTop: getResponsiveSize(12),
    borderTopWidth: getResponsiveSize(6),
    borderTopColor: colors.gray1,
  },
  check: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    marginRight: getResponsiveSize(8),
  },
});
