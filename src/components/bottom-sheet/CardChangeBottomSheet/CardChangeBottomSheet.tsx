import { Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { GetCardListResponse } from "@/api/models";
import {
  formatCardCompany,
  formatCardDisplayNumber,
  getResponsiveSize,
} from "@/utils";
import { Card } from "@/types";
import { CustomBottomSheet } from "@/components/ui/CustomBottomSheet";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomText } from "@/components/ui/CustomText";
import { checkedRadioIcon, uncheckedRadioIcon } from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  ref: React.RefObject<BottomSheetModal | null>;
  card: Card | null;
  setCard: React.Dispatch<React.SetStateAction<Card | null>>;
  cardData: GetCardListResponse | undefined;
  onPressRegister: () => void;
}

export const CardChangeBottomSheet = ({
  ref,
  card,
  setCard,
  cardData,
  onPressRegister,
}: Props) => {
  // 카드 선택
  const handleSelectCard = (value: Card) => () => {
    if (card?.id === value.id) {
      return;
    } else {
      setCard(value);
    }
  };

  const handleClose = () => {
    return ref?.current?.close();
  };

  return (
    <CustomBottomSheet
      ref={ref}
      height={getResponsiveSize(500)}
      title="카드 선택"
      onClose={handleClose}
      hasCloseButton
    >
      <View style={styles.container}>
        {cardData?.data.length ? (
          <ScrollView
            contentContainerStyle={{ gap: getResponsiveSize(16) }}
            showsVerticalScrollIndicator={false}
          >
            {cardData?.data.map((item, index) => (
              <Pressable
                key={index}
                onPress={handleSelectCard(item)}
                style={[
                  styles.card,
                  item.id === card?.id && {
                    borderWidth: 2,
                    borderColor: colors.point2,
                  },
                ]}
              >
                <Image
                  source={
                    card?.id === item.id ? checkedRadioIcon : uncheckedRadioIcon
                  }
                  style={styles.radioButton}
                />

                <CustomText marginBottom={4} fontSize={18} fontWeight={"600"}>
                  {formatCardCompany(item.cardCompany)}
                </CustomText>
                <View style={{ flexDirection: "row" }}>
                  <CustomText color={colors.gray7} fontSize={16}>
                    {formatCardDisplayNumber(item.cardDisplayNumber)}
                  </CustomText>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyBox}>
            <CustomText
              marginBottom={4}
              color={colors.gray5}
              fontSize={20}
              fontWeight={"600"}
            >
              카드를 등록해주세요
            </CustomText>
          </View>
        )}
      </View>

      <CustomButton
        onPress={onPressRegister}
        width={"100%"}
        height={getResponsiveSize(53)}
        marginTop={20}
        backgroundColor={colors.main}
      >
        <CustomText color={colors.white} fontSize={18} fontWeight={"600"}>
          결제수단 변경하기
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
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
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
