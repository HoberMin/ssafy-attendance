// src/store/useAttendanceStore.ts
import { create } from "zustand";

interface FormData {
  location: string;
  classNumber: string;
  name: string;
  birthDate: string;
  reason: string;
  attendanceDate: string;
  attendanceTime: string;
  attendancePeriod: string;
  changeDate: string;
  changeTime: string;
  changePeriod: string;
  changeReason: string;
  signatureData: string | null;
}

interface AttendanceStore {
  formData: FormData;
  updateForm: (newData: Partial<FormData>) => void;
}

const initialFormData: FormData = {
  location: "",
  classNumber: "",
  name: "",
  birthDate: "",
  reason: "입실 미클릭",
  attendanceDate: "",
  attendanceTime: "",
  attendancePeriod: "오전",
  changeDate: "",
  changeTime: "",
  changePeriod: "오전",
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
