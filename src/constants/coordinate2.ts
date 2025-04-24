export const TEXT_COORD: Record<string, [number, number]> = {
  campus: [0.35, 0.2625],
  classNumber: [0.56, 0.262],
  name: [0.35, 0.305],
  birthDate: [0.67, 0.305],
  attendanceDateYear: [0.36, 0.587],
  attendanceDateMonth: [0.5, 0.587],
  attendanceDateDay: [0.6, 0.587],
  attendanceTimeHour: [0.7, 0.587],
  attendanceTimeMinute: [0.83, 0.587],
  changeDateYear: [0.36, 0.62],
  changeDateMonth: [0.5, 0.62],
  changeDateDay: [0.6, 0.62],
  changeTimeHour: [0.7, 0.62],
  changeTimeMinute: [0.83, 0.62],
  changeReason: [0.24, 0.675],
  requestName: [0.34, 0.715],
};

export const REASON_CHECK_COORD: [number, number][] = [
  [0.22, 0.444],
  [0.387, 0.444],
  [0.56, 0.444],
  [0.72, 0.444],
];

export const SIGNATURE_COORD = [0.77, 0.672];

// 제일 아래 제출일 텍스트 좌표
export const DOCS_DATE_COORD: Record<string, [number, number]> = {
  currentYear: [0.378, 0.8925],
  currentMonth: [0.48, 0.8925],
  currentDay: [0.58, 0.8925],
};
