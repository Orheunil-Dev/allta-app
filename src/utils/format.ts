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

// 시간 포맷팅 (ex. 03:00)
export const formatTime = (value: number) => {
  const min = Math.floor(value / 60);
  const sec = value % 60;

  return `0${min}:${sec < 10 ? "0" + sec : sec}`;
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
