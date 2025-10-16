import { useRef, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSetAtom } from "jotai";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCardControllerGetCardList } from "@/api/card/card";
import { errorModalAtom } from "@/jotai";
import { CardStackParamList } from "@/navigations";
import {
  formatCardCompany,
  formatCardDisplayNumber,
  getResponsiveSize,
} from "@/utils";
import { Card } from "@/types";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CardOptionsBottomSheet } from "@/components/bottom-sheet";
import { kebabIcon, plusIcon } from "@/assets/images";
import { colors } from "@/styles";

export const CardList = () => {
  const cardStackNavigation =
    useNavigation<NativeStackNavigationProp<CardStackParamList>>();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const setErrorModal = useSetAtom(errorModalAtom);

  const [card, setCard] = useState<Card | undefined>(undefined);

  // 카드 목록 조회 API
  const { data: cardData, refetch: cardRefetch } = useCardControllerGetCardList(
    {
      query: {
        queryKey: ["cards"],
        retry: false,
        gcTime: 0,
      },
    }
  );

  // 카드 등록 화면 이동
  const handleRouteCardRegister = () => {
    if (cardData?.data.length && cardData?.data.length > 4) {
      return setErrorModal({
        visible: true,
        message: "카드는 최대 5개까지 등록 가능합니다.",
      });
    }

    return cardStackNavigation.navigate("CardRegister");
  };

  const handleOpenBottomSheet = (card: Card) => () => {
    setCard(card);
    bottomSheetRef?.current?.present();
  };
  const handleCloseBottomSheet = () => {
    setCard(undefined);
    bottomSheetRef?.current?.close();
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <CardOptionsBottomSheet
        ref={bottomSheetRef}
        id={card?.id}
        isMain={card?.isMain}
        onClose={handleCloseBottomSheet}
      />

      <View style={styles.container}>
        <CustomButton
          onPress={handleRouteCardRegister}
          width={"100%"}
          height={getResponsiveSize(64)}
          marginBottom={16}
          backgroundColor={colors.white}
          borderWidth={1}
          borderColor={colors.gray2}
        >
          <Image source={plusIcon} style={styles.plusIcon} />
          <CustomText fontSize={16}>카드 추가하기</CustomText>
        </CustomButton>

        <FlatList
          data={cardData?.data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: getResponsiveSize(16) }}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.card,
                item.isMain && {
                  borderWidth: 1,
                  borderColor: colors.point2,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: getResponsiveSize(4),
                }}
              >
                <CustomText fontSize={18} fontWeight={"600"}>
                  {formatCardCompany(item.cardCompany)}
                </CustomText>

                {item.isMain && (
                  <View style={styles.mainCard}>
                    <CustomText
                      color={colors.point2}
                      fontSize={12}
                      fontWeight={"500"}
                      lineHeight={1.4}
                    >
                      대표카드
                    </CustomText>
                  </View>
                )}
              </View>

              <Pressable
                onPress={handleOpenBottomSheet(item)}
                style={styles.kebabButton}
              >
                <Image
                  source={kebabIcon}
                  style={{
                    width: getResponsiveSize(24),
                    height: getResponsiveSize(24),
                  }}
                />
              </Pressable>

              <View style={{ flexDirection: "row" }}>
                <CustomText color={colors.gray7} fontSize={16}>
                  {formatCardDisplayNumber(item.cardDisplayNumber)}
                </CustomText>
              </View>
            </View>
          )}
        />
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: getResponsiveSize(20),
    paddingHorizontal: getResponsiveSize(20),
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
  kebabButton: {
    position: "absolute",
    top: getResponsiveSize(16),
    right: getResponsiveSize(16),
  },
  plusIcon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    marginRight: getResponsiveSize(8),
  },
  mainCard: {
    alignItems: "center",
    marginLeft: getResponsiveSize(8),
    paddingVertical: getResponsiveSize(3),
    paddingHorizontal: getResponsiveSize(7),
    borderWidth: 1,
    borderColor: colors.point2,
    borderRadius: 20,
  },
});
