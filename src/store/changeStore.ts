// src/store/useAttendanceStore.ts
import { create } from "zustand";

interface FormData {
  campusNumber: string;
  name: string;
  birthDate: string;
  reason: number;
  campusName: string;
  attendanceDate: string;
  attendanceTime: string;
  changeDate: string;
  changeTime: string;
  changeReason: string;
  signatureData: string | null;
}

interface AttendanceStore {
  formData: FormData;
  updateForm: (newData: Partial<FormData>) => void;
}

const initialFormData: FormData = {
  campusNumber: "",
  name: "",
  campusName: "",
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
