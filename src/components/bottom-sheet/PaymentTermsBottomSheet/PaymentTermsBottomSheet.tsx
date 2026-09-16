import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { getPaymentTerms } from "@/constants";
import { colors } from "@/styles";
import { getFontSize, getResponsiveSize } from "@/utils";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import RenderHTML from "react-native-render-html";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
}

const { width: screenWidth } = Dimensions.get("window");

export const PaymentTermsBottomSheet = ({ ref }: Props) => {
  const { t } = useTranslation("payment");

  const handleClose = () => {
    return ref?.current?.close();
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(600)}
      title={t("terms.title")}
      onClose={handleClose}
    >
      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <RenderHTML
          contentWidth={screenWidth - getResponsiveSize(40)}
          source={{ html: getPaymentTerms() }}
          tagsStyles={{
            h3: {
              fontFamily: "Pretendard-SemiBold",
              color: colors.black,
              fontSize: getFontSize(16),
              fontWeight: "600",
              lineHeight: getFontSize(14) * 1.5,
            },
            p: {
              fontFamily: "Pretendard-Regular",
              color: colors.black,
              fontSize: getFontSize(14),
              lineHeight: getFontSize(14) * 1.5,
            },
            li: {
              fontFamily: "Pretendard-Regular",
              color: colors.black,
              fontSize: getFontSize(14),
              lineHeight: getFontSize(14) * 1.5,
            },
          }}
        />
      </ScrollView>

      <CustomButton
        onPress={handleClose}
        width={"100%"}
        height={getResponsiveSize(53)}
        marginTop={20}
        backgroundColor={colors.main}
      >
        <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
          {t("common:confirm")}
        </CustomText>
      </CustomButton>
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: screenWidth - getResponsiveSize(40),
  },
});
