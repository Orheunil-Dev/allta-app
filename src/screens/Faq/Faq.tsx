import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { getResponsiveSize } from "@/utils";
import { CustomSafeAreaView } from "@/components/ui/CustomSafeAreaView";
import { CustomText } from "@/components/ui/CustomText";
import { colors } from "@/styles";
import { faqs } from "@/constants";
import { aIcon, grayDownArrow, qIcon } from "@/assets/images";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type Category = (typeof faqs)[number]["category"];

const FaqItem = ({ value, isOpen, onToggle }: any) => {
  const animatedAnswerStyle = useAnimatedStyle(() => ({
    height: withTiming(isOpen ? value.height ?? 80 : 0, { duration: 250 }),
    opacity: withTiming(isOpen ? 1 : 0, { duration: 250 }),
  }));

  const rotateAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(isOpen ? "180deg" : "0deg", { duration: 250 }),
      },
    ],
  }));

  return (
    <View style={styles.item}>
      <Pressable style={styles.question} onPress={onToggle}>
        <View
          style={{
            flexDirection: "row",
            flexShrink: 1,
            paddingRight: getResponsiveSize(40),
          }}
        >
          <Image source={qIcon} style={styles.icon} />
          <CustomText fontSize={16}>{value.question}</CustomText>
        </View>

        <Animated.Image
          source={grayDownArrow}
          style={[styles.arrow, rotateAnimatedStyle]}
        />
      </Pressable>

      <Animated.View style={[animatedAnswerStyle, { overflow: "hidden" }]}>
        <View style={styles.answer}>
          <Image source={aIcon} style={styles.icon} />
          <View style={{ flex: 1, paddingRight: getResponsiveSize(40) }}>
            <CustomText>{value.answer}</CustomText>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export const Faq = () => {
  const [category, setCategory] = useState<Category | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  // FAQ 카테고리
  const categories = new Set(faqs.map((faq) => faq.category).filter(Boolean));

  // FAQ 필터링
  const filteredFaqs = category
    ? faqs.filter((f) => f.category === category)
    : faqs;

  return (
    <CustomSafeAreaView edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.top}>
          <View style={{ flexDirection: "row" }}>
            <CustomText marginRight={8} fontSize={20} fontWeight={"600"}>
              고객센터 문의
            </CustomText>
            <CustomText color={colors.point2} fontSize={20} fontWeight={"600"}>
              1669-1620
            </CustomText>
          </View>

          <CustomText color={colors.gray7} fontSize={14}>
            평일 10:00 ~ 18:00
          </CustomText>
        </View>

        <View style={styles.filter}>
          <Pressable
            onPress={() => setCategory(null)}
            style={[
              styles.category,
              category === null && {
                backgroundColor: colors.point2,
                borderWidth: 0,
              },
            ]}
          >
            <CustomText color={category === null ? colors.white : colors.black}>
              전체
            </CustomText>
          </Pressable>

          {[...categories].map((value) => (
            <Pressable
              key={value}
              onPress={() => setCategory(value)}
              style={[
                styles.category,
                value === category && {
                  backgroundColor: colors.point2,
                  borderWidth: 0,
                },
              ]}
            >
              <CustomText
                color={value === category ? colors.white : colors.black}
                fontSize={14}
              >
                {value}
              </CustomText>
            </Pressable>
          ))}
        </View>

        <View>
          {filteredFaqs.map((value, i) => (
            <FaqItem
              key={i}
              value={value}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: getResponsiveSize(20),
  },
  top: {
    paddingVertical: getResponsiveSize(24),
    paddingHorizontal: getResponsiveSize(20),
    borderBottomWidth: 6,
    borderBottomColor: colors.gray1,
  },
  filter: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: getResponsiveSize(20),
    gap: getResponsiveSize(8),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  category: {
    paddingVertical: getResponsiveSize(6),
    paddingHorizontal: getResponsiveSize(14),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
  },
  item: {
    paddingVertical: getResponsiveSize(24),
    paddingHorizontal: getResponsiveSize(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  question: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  answer: {
    flexDirection: "row",
    paddingTop: getResponsiveSize(24),
  },
  icon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    marginRight: getResponsiveSize(8),
  },
  arrow: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
  },
});
