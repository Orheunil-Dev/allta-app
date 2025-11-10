import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCardControllerGetCardList } from "@/api/card/card";
import { usePassControllerUpdateSubscriptionCard } from "@/api/pass/pass";
import { GetSubscriptionDetailResponse } from "@/api/models";
import { ContainerStackParamList } from "@/navigations";
import { errorModalAtom } from "@/jotai";
import { useToastMessage } from "@/hooks";
import { getResponsiveSize } from "@/utils";
import { Card } from "@/types";
import { CardChangeBottomSheet } from "@/components/bottom-sheet/CardChangeBottomSheet";
import { CustomModal } from "@/components/ui/CustomModal";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";

interface Props {
  subscriptionId: string;
  cardCompany: string;
  cardDisplayNumber: string;
  subscriptionRefetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<GetSubscriptionDetailResponse, unknown>>;
}

export const CardChangeButton = ({
  subscriptionId,
  cardCompany,
  cardDisplayNumber,
  subscriptionRefetch,
}: Props) => {
  const containerNavigation =
    useNavigation<NativeStackNavigationProp<ContainerStackParamList>>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const setErrorModal = useSetAtom(errorModalAtom);

  const [card, setCard] = useState<Card | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const { SuccessToast, ErrorToast } = useToastMessage();

  // 카드 목록 조회 API
  const { data: cardData, refetch: cardsRefetch } =
    useCardControllerGetCardList({
      query: {
        queryKey: ["cards"],
        retry: false,
        gcTime: 0,
      },
    });

  // 결제수단 변경 API
  const {
    mutate: updateSubscriptionCard,
    isPending: updateSubscriptionCardLoading,
    isError: updateSubscriptionCardError,
  } = usePassControllerUpdateSubscriptionCard();

  // 결제수단 변경
  const handleChangeCard = () => {
    if (!card) {
      setShowModal(false);
      return ErrorToast("결제수단이 선택되지 않았습니다.");
    }

    if (
      card.cardDisplayNumber === cardDisplayNumber &&
      card.cardCompany === cardCompany
    ) {
      setShowModal(false);
      return ErrorToast("기존 결제수단과 동일한 카드입니다.");
    }

    bottomSheetRef.current?.close();

    updateSubscriptionCard(
      {
        data: {
          cardId: card.id,
          subscriptionId,
        },
      },
      {
        onSuccess: () => {
          SuccessToast("결제수단이 변경되었습니다.");
          setShowModal(false);
          return subscriptionRefetch();
        },
        onError: () => {
          ErrorToast("결제수단이 변경 중 오류가 발생했습니다.");
          return setShowModal(false);
        },
      }
    );
  };

  // 카드 목록 중 결제한 카드
  useEffect(() => {
    if (cardData?.data && cardData.data.length > 0) {
      const foundCard = cardData.data.find(
        (item) =>
          item.cardCompany === cardCompany &&
          item.cardDisplayNumber === cardDisplayNumber
      );

      if (foundCard) {
        setCard(foundCard);
      }
    }
  }, [cardData?.data]);

  return (
    <Pressable
      onPress={() => bottomSheetRef.current?.present()}
      style={styles.container}
    >
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        closeButtonText="취소"
        onNext={handleChangeCard}
        isNextButtonDisable={updateSubscriptionCardLoading}
        nextButtonText="변경하기"
      >
        <CustomText fontSize={18} fontWeight={"600"}>
          카드 변경
        </CustomText>

        <CustomText marginTop={8} fontSize={16}>
          다음 결제일부터 새로운 결제수단으로
        </CustomText>
        <CustomText fontSize={16}>자동 결제가 진행됩니다.</CustomText>

        <CustomText marginTop={8} fontSize={16}>
          변경하시겠습니까?
        </CustomText>
      </CustomModal>

      <CardChangeBottomSheet
        ref={bottomSheetRef}
        card={card}
        setCard={setCard}
        cardData={cardData}
        onPressRegister={() => setShowModal(true)}
      />

      <CustomText color={colors.gray7} fontSize={12} fontWeight={"500"}>
        변경
      </CustomText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: getResponsiveSize(8),
    paddingVertical: getResponsiveSize(4),
    paddingHorizontal: getResponsiveSize(10),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
  },
});
