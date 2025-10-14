import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CardStackParamList } from "@/navigations";
import {
  formatCardCompany,
  formatCardDisplayNumber,
  getResponsiveSize,
} from "@/utils";
import { CustomText } from "@/components/ui/CustomText";
import { CustomButton } from "@/components/ui/CustomButton";
import { colors } from "@/styles";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { kebabIcon, plusIcon } from "@/assets/images";
import { useSetAtom } from "jotai";
import { errorModalAtom } from "@/jotai";
import { useCardControllerGetCardList } from "@/api/card/card";

export const CardList = () => {
  const cardStackNavigation =
    useNavigation<NativeStackNavigationProp<CardStackParamList>>();

  const setErrorModal = useSetAtom(errorModalAtom);

  // 카드 목록 조회 API
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
        message: "카드는 최대 5개까지 등록 가능합니다.",
      });
    }

    return cardStackNavigation.navigate("CardRegister");
  };

  return (
    <CustomSafeAreaView edges={["bottom"]}>
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
                  borderWidth: 2,
                  borderColor: colors.point2,
                },
              ]}
            >
              <CustomText marginBottom={4} fontSize={18} fontWeight={"600"}>
                {formatCardCompany(item.cardCompany)}
              </CustomText>

              <Pressable style={styles.kebabButton}>
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
    paddingHorizontal: getResponsiveSize(20),
    paddingBottom: getResponsiveSize(20),
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
});
