import i18n from "@/i18n";

export const formatLoginKind = (text: string): string => {
  switch (text) {
    case "KAKAO":
      return i18n.t("format:loginKind.kakao");

    case "GOOGLE":
      return i18n.t("format:loginKind.google");

    case "APPLE":
      return i18n.t("format:loginKind.apple");

    case "TEST":
      return i18n.t("format:loginKind.test");

    default:
      return text;
  }
};

// 전화번호 포매팅 (ex. 010-0000-0000)
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

// 카드 번호 포매팅
export const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);

  const part1 = digits.slice(0, 4);
  const part2 = digits.slice(4, 8);
  const part3 = digits.slice(8, 12);
  const part4 = digits.slice(12, 16);

  return [part1, part2, part3, part4].filter(Boolean).join("-");
};

// 시간 포매팅 (ex. 03:00)
export const formatTime = (value: number) => {
  const min = Math.floor(value / 60);
  const sec = value % 60;

  return `0${min}:${sec < 10 ? "0" + sec : sec}`;
};

// 유효기간 포매팅
export const formatCardExpiration = (value: string) => {
  const digits = value.replace(/\D/g, "");

  switch (true) {
    case digits.length <= 2:
      return digits;

    default:
      return `${digits.slice(0, 2)} / ${digits.slice(2, 4)}`;
  }
};

// 알림 날짜 포매팅
export const formatNotificationTime = (value: string) => {
  const now = new Date();
  const nowKst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const target = new Date(value);
  const targetKst = new Date(target.getTime() + 9 * 60 * 60 * 1000);

  const diffTime = nowKst.getTime() - targetKst.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  switch (diffDays) {
    case 0:
      return i18n.t("format:relativeDate.today");

    case 1:
      return i18n.t("format:relativeDate.yesterday");

    default:
      return i18n.t("format:relativeDate.daysAgo", { count: diffDays });
  }
};

// 서비스 종류
export const formatServiceType = (text: string): string => {
  switch (text) {
    case "AUTO":
      return i18n.t("format:serviceType.auto");

    case "HANDS":
      return i18n.t("format:serviceType.hands");

    default:
      return text;
  }
};

// 이용권 종류
export const formatPassType = (text: string): string | null => {
  switch (text) {
    case "PREMIUM":
      return i18n.t("format:passType.premium");

    case "STANDARD":
      return i18n.t("format:passType.standard");

    case "TICKET":
      return i18n.t("format:passType.ticket");

    default:
      return text;
  }
};

// 이용권 종류 (결제)
export const formatPurchaseType = (text: string): string | null => {
  switch (text) {
    case "PREMIUM":
      return i18n.t("format:purchaseType.premium");

    case "STANDARD":
      return i18n.t("format:purchaseType.standard");

    case "TICKET":
      return i18n.t("format:purchaseType.ticket");

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
export const formatCouponValue = (type: string, value: number): string => {
  switch (type) {
    case "RATE":
      return i18n.t("format:couponValue.rate", { value });

    case "PRICE":
      return i18n.t("format:couponValue.price", {
        value: value.toLocaleString(),
      });

    case "FIXED":
      return i18n.t("format:couponValue.fixed", {
        value: value.toLocaleString(),
      });

    default:
      return i18n.t("format:couponValue.price", {
        value: value.toLocaleString(),
      });
  }
};

// 쿠폰 적용 이용권 포매팅
export const formatCouponPassType = (
  serviceType: string | null,
  passType: string | null
): string => {
  let serviceLabel = "";
  if (serviceType === "AUTO") serviceLabel = i18n.t("format:serviceType.auto");
  else if (serviceType === "HANDS")
    serviceLabel = i18n.t("format:serviceType.hands");

  if (!passType)
    return serviceLabel
      ? i18n.t("format:couponPassType.allServicePasses", {
          service: serviceLabel,
        })
      : i18n.t("format:couponPassType.allPasses");

  const passTypes = passType.split(",").map((v) => v.trim());

  const typeMap: Record<string, string> = {
    STANDARD: i18n.t("format:passType.standard"),
    PREMIUM: i18n.t("format:passType.premium"),
    TICKET: i18n.t("format:passType.ticket"),
  };

  const order = ["TICKET", "STANDARD", "PREMIUM"];
  const sorted = passTypes.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  const formatted = sorted
    .map((type) => typeMap[type] || type)
    .join(i18n.t("format:couponPassType.separator"));

  if (serviceLabel) {
    return i18n.t("format:couponPassType.servicePasses", {
      service: serviceLabel,
      passes: formatted,
    });
  }

  return formatted;
};

// 카드번호 포매팅
export const formatCardDisplayNumber = (value?: string | null) => {
  if (!value) return "";

  return `****-****-****-${value}`;
};

// 카드사 포매팅
export const formatCardCompany = (value?: string | null) => {
  if (!value) return "";

  // 카드사 코드 → format 네임스페이스 cardCompany 키
  const cardCompanyKeyMap: Record<string, string> = {
    "01": "bc",
    "02": "shinhan",
    "03": "samsung",
    "04": "hyundai",
    "05": "lotte",
    "06": "jcb",
    "07": "kbKookmin",
    "08": "hana",
    "09": "overseas",
    "10": "woori",
    "11": "suhyup",
    "12": "nonghyup",
    "13": "citi",
    "14": "woori",
    "15": "citi",
    "17": "shinhyup",
    "18": "unionPay",
    "19": "lotte",
    "22": "jeju",
    "23": "gwangju",
    "24": "jeonbuk",
    "25": "chohung",
    "26": "jutaek",
    "27": "hana",
    "30": "citi",
  };

  const companyKey = cardCompanyKeyMap[value];
  const company = companyKey
    ? i18n.t(`format:cardCompany.${companyKey}`)
    : value;

  return i18n.t("format:cardCompany.label", { company });
};

// 매장 전화번호 포매팅
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

// 영수증 승인 날짜 포매팅
export const formatApprovalDate = (date: string): string => {
  const dateFormat = date.length === 6 ? `20${date}` : date;

  return dateFormat
};

// 남은 사용 횟수 포매팅
export const formatUsageLeft = (usage: number, maxUsage: number): number => {
  return maxUsage - usage;
};

// 결제 내역 상태 포매팅
export const formatPurchaseStatus = (text: string): string => {
  switch (text) {
    case "APPROVED":
      return i18n.t("format:purchaseStatus.approved");

    case "PARTIAL_REFUNDED":
      return i18n.t("format:purchaseStatus.partialRefunded");

    case "REFUNDED":
      return i18n.t("format:purchaseStatus.refunded");

    default:
      return text;
  }
};

// 결제 내역 스냅샷 상태 포매팅
export const formatPaymentStatus = (text: string): string => {
  switch (text) {
    case "APPROVED":
      return i18n.t("format:paymentStatus.approved");

    case "PARTIAL_REFUNDED":
      return i18n.t("format:paymentStatus.partialRefunded");

    case "REFUNDED":
      return i18n.t("format:paymentStatus.refunded");

    default:
      return text;
  }
};

// 반환값은 사용자에게 노출되지 않는 내부 구분값 (constants/weather.ts, WeatherCast에서 키로 매칭)
export const formatWeatherIcon = (code: string | null) => {
  if (!code) {
    return "화창";
  }

  if (
    [
      "1",
      "2",
      "3",
      "4",
      "5",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
    ].includes(code)
  ) {
    return "화창";
  } else if (["6", "7", "8", "11", "38"].includes(code)) {
    return "흐림";
  } else if (
    [
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "26",
      "39",
      "40",
      "41",
      "42",
      "43",
    ].includes(code)
  ) {
    return "비";
  } else if (
    ["19", "20", "21", "22", "23", "24", "25", "29", "44"].includes(code)
  ) {
    return "눈";
  } else {
    return "화창";
  }
};
