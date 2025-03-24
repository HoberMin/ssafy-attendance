import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  MapPin,
  Users,
  User,
  Calendar,
  Clock,
  ClipboardEdit,
  Pen,
  IdCard,
} from "lucide-react";
import useAttendanceStore from "@/store/changeStore";
import { useRouter } from "next/router";
import SignatureCanvas from "./SignatureCanvas";

interface FormData {
  location: string;
  classNumber: string;
  name: string;
  campus: string;
  birthDate: string;
  reason: number;
  attendanceDate: string;
  attendanceTime: string;
  changeDate: string;
  changeTime: string;
  changeReason: string;
  signatureData: string | null;
}

const AttendanceChangeForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    location: "",
    classNumber: "",
    name: "",
    campus: "",
    birthDate: "",
    reason: 0,
    attendanceDate: "",
    attendanceTime: "",
    changeDate: "",
    changeTime: "",
    changeReason: "",
    signatureData: null,
  });

  const locations = ["서울", "대전", "구미", "부울경", "대구"];
  const reasons = ["입실 미클릭", "입실 오클릭", "퇴실 미클릭", "퇴실 오클릭"];

  const { updateForm } = useAttendanceStore();

  const handleSignatureChange = (signatureData: string | null) => {
    setFormData((prev) => ({
      ...prev,
      signatureData: signatureData,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm({
      ...formData,
      campusName: formData.location,
      campusNumber: formData.classNumber,
    });
    router.push("/preview2");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 지역 선택 */}
          <div className="space-y-2">
            <Label
              htmlFor="location"
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="지역 선택"
            >
              <MapPin className="w-4 h-4 text-[#3396f4]" />
              지역
            </Label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
            >
              <option value="">선택하세요</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 반 번호 */}
          <div className="space-y-2">
            <Label
              htmlFor="classNumber"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Users className="w-4 h-4 text-[#3396f4]" />반
            </Label>
            <Input
              type="text"
              id="classNumber"
              value={formData.classNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  classNumber: e.target.value,
                }))
              }
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
            />
          </div>

          {/* 성명 */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <User className="w-4 h-4 text-[#3396f4]" />
              성명
            </Label>
            <Input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
            />
          </div>

          {/* 생년월일 */}
          <div className="space-y-2">
            <Label
              htmlFor="birthDate"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <IdCard className="w-4 h-4 text-[#3396f4]" />
              생년월일
            </Label>
            <Input
              type="text"
              id="birthDate"
              placeholder="YY.MM.DD"
              value={formData.birthDate}
              onChange={(e) => {
                const value = e.target.value;
                const numbers = value.replace(/\D/g, "");

                let formattedDate = "";
                for (let i = 0; i < numbers.length && i < 6; i++) {
                  if (i === 2 || i === 4) {
                    formattedDate += ".";
                  }
                  formattedDate += numbers[i];
                }

                setFormData((prev) => ({
                  ...prev,
                  birthDate: formattedDate,
                }));
              }}
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <ClipboardEdit className="w-4 h-4 text-[#3396f4]" />
              사유
            </Label>
            <RadioGroup
              value={formData.reason.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, reason: parseInt(value) }))
              }
              className="grid grid-cols-2 gap-4"
            >
              {reasons.map((reason, index) => (
                <div key={reason} className="flex items-center">
                  <RadioGroupItem
                    value={index.toString()}
                    id={reason}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={reason}
                    className={`flex items-center justify-center w-full px-4 py-2 rounded-lg border-2 
                             cursor-pointer text-center transition-all duration-200
                             ${
                               formData.reason === index
                                 ? "bg-[#3396f4] text-white border-[#3396f4] shadow-md transform scale-[1.02]"
                                 : "bg-white text-gray-700 border-gray-200 hover:bg-[#3396f4]/10 hover:border-[#3396f4]/30"
                             }`}
                  >
                    {reason}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-[#3396f4]" />
              출결일시
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={formData.attendanceDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    attendanceDate: e.target.value,
                  }))
                }
                className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              />
              <Input
                type="time"
                value={formData.attendanceTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    attendanceTime: e.target.value,
                  }))
                }
                className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-[#3396f4]" />
              변경일시
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={formData.changeDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    changeDate: e.target.value,
                  }))
                }
                className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
                required
              />
              <Input
                type="time"
                value={formData.changeTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    changeTime: e.target.value,
                  }))
                }
                className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="changeReason"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <ClipboardEdit className="w-4 h-4 text-[#3396f4]" />
              변경사유 (최대 60자)
            </Label>
            <textarea
              id="changeReason"
              value={formData.changeReason}
              onChange={(e) => {
                if (e.target.value.length <= 60) {
                  setFormData((prev) => ({
                    ...prev,
                    changeReason: e.target.value,
                  }));
                }
              }}
              className="w-full p-2 border rounded-md min-h-[80px] resize-none 
                       focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              maxLength={60}
              required
            />
            <div className="text-sm text-gray-500 text-right">
              {formData.changeReason.length}/60자
            </div>
          </div>

          <div className="space-y-2">
            <Label
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="서명 입력"
            >
              <Pen className="w-4 h-4 text-[#3396f4]" />
              서명
            </Label>
            <SignatureCanvas
              initialSignature={formData.signatureData}
              onSignatureChange={handleSignatureChange}
              width={250}
              height={150}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3396f4] hover:bg-[#3396f4]/80 text-white py-2 rounded-lg 
                     transition-colors duration-200 focus:ring-2 focus:ring-[#3396f4] focus:ring-offset-2"
          >
            양식 미리보기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AttendanceChangeForm;
