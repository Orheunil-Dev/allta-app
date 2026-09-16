import i18n from "@/i18n";

// 이용권 종류
export const passTypes = ["TICKET", "STANDARD", "PREMIUM"];

// 태그 (API 요청 파라미터 및 서버 데이터와 매칭되는 값이므로 번역하지 않음)
export const storeTags = [
  "브러시",
  "노브러시",
  "하부세차",
  "프리워시",
  "버블",
  "물기제거",
];

const storeTagLabelKeys: Record<string, string> = {
  브러시: "brush",
  노브러시: "noBrush",
  하부세차: "underbody",
  프리워시: "preWash",
  버블: "bubble",
  물기제거: "drying",
};

// 태그 값 → 화면 표시용 라벨 (알 수 없는 태그는 원문 그대로 표시)
export const getStoreTagLabel = (tag: string): string => {
  const labelKey = storeTagLabelKeys[tag];

  if (!labelKey) return tag;

  return i18n.t(`store:filter.tags.${labelKey}`);
};

// 국번
export const areaCodes = [
  "02",
  "031",
  "032",
  "033",
  "041",
  "042",
  "043",
  "044",
  "051",
  "052",
  "053",
  "054",
  "055",
  "061",
  "062",
  "063",
  "064",
];
