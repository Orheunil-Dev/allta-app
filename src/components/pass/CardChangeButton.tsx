import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("pass");

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
      return ErrorToast(t("cardChange.notSelected"));
    }

    if (
      card.cardDisplayNumber === cardDisplayNumber &&
      card.cardCompany === cardCompany
    ) {
      setShowModal(false);
      return ErrorToast(t("cardChange.sameCard"));
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
          SuccessToast(t("cardChange.success"));
          setShowModal(false);
          return subscriptionRefetch();
        },
        onError: () => {
          ErrorToast(t("cardChange.error"));
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
        closeButtonText={t("common:cancel")}
        onNext={handleChangeCard}
        isNextButtonDisable={updateSubscriptionCardLoading}
        nextButtonText={t("cardChange.confirmButton")}
      >
        <CustomText fontSize={18} fontWeight={"600"}>
          {t("cardChange.modalTitle")}
        </CustomText>

        <CustomText marginTop={8} textAlign="center" fontSize={16}>
          {t("cardChange.modalMessage")}
        </CustomText>

        <CustomText marginTop={8} fontSize={16}>
          {t("cardChange.modalConfirm")}
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
        {t("common:change")}
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
