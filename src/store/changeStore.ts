// src/store/useAttendanceStore.ts
import { create } from "zustand";

export interface IFFormData {
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
  formData: IFFormData;
  updateForm: (newData: Partial<IFFormData>) => void;
}

const initialFormData: IFFormData = {
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
