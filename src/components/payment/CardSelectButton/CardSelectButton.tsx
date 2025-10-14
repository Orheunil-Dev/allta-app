import { useEffect, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import { CustomButton } from "@/components/ui/CustomButton";
import { useCardControllerGetCardList } from "@/api/card/card";
import {
  formatCardCompany,
  formatCardDisplayNumber,
  getResponsiveSize,
} from "@/utils";
import { Card } from "@/types";
import { CustomText } from "@/components/ui/CustomText";
import { CardListBottomSheet } from "@/components/bottom-sheet/CardListBottomSheet";
import { ContainerStackParamList } from "@/navigations";
import { blackRightArrow } from "@/assets/images";
import { colors } from "@/styles";

interface Props {
  card: Card | null;
  setCard: React.Dispatch<React.SetStateAction<Card | null>>;
}

export const CardSelectButton = ({ card, setCard }: Props) => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const setErrorModal = useSetAtom(errorModalAtom);

  const { data: cardData, refetch: cardsRefetch } =
    useCardControllerGetCardList({
      query: {
        queryKey: ["cards"],
        retry: false,
        gcTime: 0,
      },
    });

  // 카드 등록
  const handleRouteCardRegister = () => {
    if (cardData?.data.length && cardData?.data.length > 4) {
      return setErrorModal({
        visible: true,
        message: "차량은 최대 5대까지 등록 가능합니다.",
      });
    }

    bottomSheetRef.current?.close();

    return containerNavigation.navigate("CardStack", {
      screen: "CardRegister",
    });
  };

  useEffect(() => {
    if (cardData?.data && cardData.data.length > 0) {
      const mainCard = cardData.data.find((card) => card.isMain);

      if (mainCard) {
        setCard(mainCard);
      } else {
        setCard(cardData.data[0]);
      }
    }
  }, [cardData?.data]);

  return (
    <View style={{ marginTop: getResponsiveSize(40) }}>
      <CardListBottomSheet
        ref={bottomSheetRef}
        card={card}
        setCard={setCard}
        cardData={cardData}
        onPressRegister={handleRouteCardRegister}
      />

      <CustomText fontSize={18} fontWeight={"600"}>
        결제 수단
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
            {card
              ? `${formatCardCompany(
                  card.cardCompany
                )} ${formatCardDisplayNumber(card.cardDisplayNumber)}`
              : "카드를 등록해주세요"}
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
