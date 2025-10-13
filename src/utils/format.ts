import { PassType } from "@/types";

// 전화번호 포맷팅 (ex. 010-0000-0000)
export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");

  switch (true) {
    case digits.length <= 3:
      return digits;

    case digits.length <= 7:
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;

    default:
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(
        7,
        11
      )}`;
  }
};

// 카드 번호 포맷팅
export const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);

  const part1 = digits.slice(0, 4);
  const part2 = digits.slice(4, 8);
  const part3 = digits.slice(8, 12);
  const part4 = digits.slice(12, 16);

  return [part1, part2, part3, part4].filter(Boolean).join("-");
};

// 시간 포맷팅 (ex. 03:00)
export const formatTime = (value: number) => {
  const min = Math.floor(value / 60);
  const sec = value % 60;

  return `0${min}:${sec < 10 ? "0" + sec : sec}`;
};

// 유효기간 포맷팅
export const formatCardExpiration = (value: string) => {
  const digits = value.replace(/\D/g, "");

  switch (true) {
    case digits.length <= 2:
      return digits;

    default:
      return `${digits.slice(0, 2)} / ${digits.slice(2, 4)}`;
  }
};

// 알림 날짜 포맷팅
export const formatNotificationTime = (value: string) => {
  const now = new Date();
  const nowKst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const target = new Date(value);
  const targetKst = new Date(target.getTime() + 9 * 60 * 60 * 1000);

  const diffTime = nowKst.getTime() - targetKst.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  switch (diffDays) {
    case 0:
      return "오늘";

    case 1:
      return "어제";

    default:
      return `${diffDays}일 전`;
  }
};

// 서비스 종류
export const formatServiceType = (text: string): string | null => {
  switch (text) {
    case "AUTO":
      return "자동세차";

    case "HANDS":
      return "핸즈클리닝";

    default:
      return text;
  }
};

// 이용권 종류
export const formatPassType = (text: string): string | null => {
  switch (text) {
    case "PREMIUM":
      return "프리미엄";

    case "STANDARD":
      return "스탠다드";

    case "TICKET":
      return "일회권";

    default:
      return text;
  }
};

// 이용권 종류 (결제)
export const formatPurchaseType = (text: string): string | null => {
  switch (text) {
    case "PREMIUM":
      return "프리미엄 구독권";

    case "STANDARD":
      return "스탠다드 구독권";

    case "TICKET":
      return "일회권";

    default:
      return text;
  }
};

// 텍스트 ...처리
export const formatEllipsis = (text: string, length: number) => {
  if (text.length > length) {
    return text.slice(0, length) + "...";
  } else {
    return text;
  }
};

// 쿠폰 할인 정보
export const formatCouponValue = (type: string, value: number) => {
  switch (type) {
    case "RATE":
      return `${value}%`;

    case "PRICE":
      return `${value}원`;

    case "FIXED":
      return `${value}원`;

    default:
      return `${value}원`;
  }
};

// 카드번호 포맷팅
export const formatCardDisplayNumber = (value: string) => {
  return `****-****-****-${value}`;
};

// 카드사 포맷팅
export const formatCardCompany = (value: string) => {
  const cardCompanyMap: Record<string, string> = {
    "01": "BC",
    "02": "신한",
    "03": "삼성",
    "04": "현대",
    "05": "롯데",
    "06": "JCB",
    "07": "KB국민",
    "08": "하나",
    "09": "해외",
    "10": "우리",
    "11": "수협",
    "12": "농협",
    "13": "시티",
    "14": "우리",
    "15": "시티",
    "17": "신협",
    "18": "은련",
    "19": "롯데",
    "22": "제주",
    "23": "광주",
    "24": "전북",
    "25": "조흥",
    "26": "주택",
    "27": "하나",
    "30": "시티",
  };

  return cardCompanyMap[value] ?? value;
};

// 매장 전화번호 포맷팅
export const formatStorePhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  // 서울 번호 (2자리 지역번호)
  if (digits.startsWith("02")) {
    if (digits.length === 9) {
      return digits.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (digits.length === 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    }
  }
  // 나머지 지역번호 (3자리 지역번호)
  else {
    if (digits.length === 10) {
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
  }

  return value;
};

// 영수증 승인 날짜 포맷팅
export const formatApprovalDate = (date: string, time: string): string => {
  const dateFormat = date.length === 6 ? `20${date}` : date;
  const timeFormat = time.length === 4 ? `${time}00` : time;

  return dateFormat + timeFormat;
};

// 남은 사용 횟수 포맷팅
export const formatUsageLeft = (usage: number, maxUsage: number): number => {
  return maxUsage - usage;
};
