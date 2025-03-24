import { create } from "zustand";

export interface AttendanceChangeForm {
  classNumber: number;
  campus: string;
  name: string;
  birthDate: string;
  reason: number;
  attendanceDate: string;
  attendanceTime: string;
  changeDate: string;
  changeTime: string;
  changeReason: string;
  signatureData: string | null;
}

interface AttendanceStore {
  formData: AttendanceChangeForm;
  updateForm: (newData: Partial<AttendanceChangeForm>) => void;
}

const initialFormData: AttendanceChangeForm = {
  classNumber: 0,
  campus: "",
  name: "",
  birthDate: "",
  reason: 0,
  attendanceDate: "",
  attendanceTime: "",
  changeDate: "",
  changeTime: "",
  changeReason: "",
  signatureData: null,
};

const useAttendanceStore = create<AttendanceStore>((set) => ({
  formData: initialFormData,
  updateForm: (newData) =>
    set((state) => ({
      formData: { ...state.formData, ...newData },
    })),
}));

export default useAttendanceStore;
