import i18n from "@/i18n";

// 서버가 아직 한국어(또는 NestJS 기본 영어)로 내려주는 메시지를 앱 언어로 치환한다.
const SERVER_MESSAGE_KEYS: Record<string, string> = {
  "매장 정보가 조회되지 않습니다.": "server:storeNotFound",
  "상품 금액에 오류가 발생했습니다.": "server:productPriceError",
  "상품 정보가 없습니다.": "server:productNotFound",
  "상품 정보가 올바르지 않습니다.": "server:productInvalid",
  "업로드 실패": "server:uploadFailed",
  "카드 등록 실패": "server:cardRegisterFailed",
  "카드 정보가 조회되지 않습니다.": "server:cardNotFound",
  "쿠폰 정보가 조회되지 않습니다.": "server:couponNotFound",
  "회원 정보가 조회되지 않습니다.": "server:userNotFound",
  "승인 실패": "server:approvalFailed",
  Unauthorized: "server:unauthorized",
  "Forbidden resource": "server:forbidden",
  Forbidden: "server:forbidden",
  "Not Found": "server:notFound",
  "Bad Request": "server:badRequest",
  "Internal server error": "server:internalError",
};

const localizeOne = (message: string): string => {
  const key = SERVER_MESSAGE_KEYS[message.trim()];
  return key ? i18n.t(key) : message;
};

export const localizeServerMessage = (
  message: unknown
): string | undefined => {
  if (Array.isArray(message)) {
    return message.filter((m) => typeof m === "string").map(localizeOne).join("\n");
  }

  if (typeof message !== "string") return undefined;

  return localizeOne(message);
};
