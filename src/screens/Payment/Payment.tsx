import {
  blackRightArrow,
  checkAllButton,
  checkedCheckAllButton,
  defaultStoreImage,
  rigthArrowIcon,
} from "@/assets/images";
import { BottomButtonArea } from "@/components/layout/BottomButtonArea";
import { PaymentTermsBottomSheet } from "@/components/payment/PaymentTermsBottomSheet";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { PaymentStackParamList } from "@/navigations";
import { colors } from "@/styles";
import { formatPurchaseType, getFontSize, getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RenderHTML from "react-native-render-html";

type PaymentRouteProp = RouteProp<PaymentStackParamList, "Payment">;

export const Payment = () => {
  const router = useRoute<PaymentRouteProp>();

  const termsBottomSheetRef = useRef<BottomSheetModal>(null);

  const [paymentForm, setPaymentForm] = useState({});
  const [agree, setAgree] = useState<boolean>(false);

  const paymentNavigation =
    useNavigation<NativeStackNavigationProp<PaymentStackParamList>>();

  const handleOpenTerms = () => {
    termsBottomSheetRef.current?.present();
  };

  const handlePayment = () => {
    return paymentNavigation.navigate("PaymentComplete");
  };

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
              {router.params.price["SEDAN"].toLocaleString()} 원
            </CustomText>
          </View>
          <View style={styles.dicount}>
            <CustomText fontSize={14}>쿠폰 할인</CustomText>
            <CustomText fontSize={14} fontWeight={"600"}>
              - 0 원
            </CustomText>
          </View>
        </View>

        {/* 쿠폰 선택 */}
        <CustomText marginTop={40} fontSize={18} fontWeight={"600"}>
          쿠폰
        </CustomText>

        <CustomButton
          height={getResponsiveSize(48)}
          marginTop={12}
          borderWidth={1}
          borderColor={colors.line}
        >
          <View style={styles.button}>
            <CustomText fontSize={15} fontWeight={"500"}>
              사용 가능한 쿠폰이 없습니다
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

        {/* 차량 선택 */}
        <CustomText marginTop={40} fontSize={18} fontWeight={"600"}>
          등록 차량
        </CustomText>

        <CustomButton
          height={getResponsiveSize(48)}
          marginTop={12}
          borderWidth={1}
          borderColor={colors.line}
        >
          <View style={styles.button}>
            <CustomText fontSize={15} fontWeight={"500"}>
              차량을 등록해주세요
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

        {/* 카드 선택 */}
        <CustomText marginTop={40} fontSize={18} fontWeight={"600"}>
          결제 수단
        </CustomText>

        <CustomButton
          height={getResponsiveSize(48)}
          marginTop={12}
          borderWidth={1}
          borderColor={colors.line}
        >
          <View style={styles.button}>
            <CustomText fontSize={15} fontWeight={"500"}>
              카드를 등록해주세요
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

        <CustomText marginTop={40} fontSize={18} fontWeight={"600"}>
          결제 금액
        </CustomText>

        <View style={{ marginTop: getResponsiveSize(12) }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <CustomText fontSize={16}>이용권 금액</CustomText>
            <CustomText fontSize={16}>
              {router.params.price["SEDAN"].toLocaleString()} 원
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
              0 원
            </CustomText>
          </View>
        </View>

        <View style={styles.totalAmount}>
          <CustomText fontSize={18} fontWeight={"600"}>
            최종 결제 금액
          </CustomText>
          <CustomText color={colors.point2} fontSize={18} fontWeight={"600"}>
            {router.params.price["SEDAN"].toLocaleString()} 원
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
            onPress={handleOpenTerms}
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
          isDisabled={!agree}
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
