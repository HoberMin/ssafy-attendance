// 본문 영역 텍스트 좌표
export const fontStyleOneCoordinate: Record<string, [number, number]> = {
  name: [0.32, 0.2293],
  birthday: [0.66, 0.229],
  absentYear: [0.354, 0.273],
  absentMonth: [0.444, 0.273],
  absentDay: [0.52, 0.273],

  absentDetailCoordinate: [0.35, 0.55], // 세부내용
  absentPlace: [0.32, 0.647], // 장소
  absentName: [0.32, 0.68], // 서명 이름
  signature: [0.8, 0.64], // 서명 사인
};

// 제일 아래 제출일 텍스트 좌표
export const fontStyleTwoCoordinate: Record<string, [number, number]> = {
  currentYear: [0.374, 0.9005],
  currentMonth: [0.485, 0.9005],
  currentDay: [0.585, 0.9005],
};

// 공가/사유 체크박스 : [공가, 사유]
export const absentCategoryCoordinate = [
  [0.137, 0.267],
  [0.137, 0.297],
];

// 공가/사유 내용 [공가, 사유]
export const absentDetailReasonCoordinate: [
  [number, number],
  [number, number]
] = [
  [0.31, 0.413],
  [0.53, 0.455],
];

export const absentTimeCoordinate = [
  [0.6075, 0.26],
  [0.7, 0.26],
  [0.7915, 0.26],
];
