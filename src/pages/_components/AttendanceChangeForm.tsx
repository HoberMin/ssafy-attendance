import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
import useAttendanceStore, {
  AttendanceChangeForm as StoreFormData,
} from "@/store/changeStore";
import { useRouter } from "next/router";
import SignatureCanvas from "./SignatureCanvas";
import { addClassRecord } from "@/utils/supabaseClient";

const AttendanceChangeForm = () => {
  const router = useRouter();

  const { formData: storeData, updateForm } = useAttendanceStore();

  const [formData, setFormData] = useState<StoreFormData>({
    ...storeData,
  });

  const locations = ["서울", "대전", "구미", "부울경", "광주"];
  const reasons = ["입실 미클릭", "입실 오클릭", "퇴실 미클릭", "퇴실 오클릭"];

  useEffect(() => {
    setFormData(storeData);
  }, [storeData]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBirthDateChange = (e: ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleLimitedTextChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    maxLength: number
  ) => {
    const { name, value } = e.target;
    if (value.length <= maxLength) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSignatureChange = (signatureData: string | null) => {
    setFormData((prev) => ({
      ...prev,
      signatureData: signatureData,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    updateForm(formData);
    await addClassRecord(formData.campus, String(formData.classNumber));
    router.push("/preview2");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="campus"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <MapPin className="w-4 h-4 text-[#3396f4]" />
              지역
            </Label>
            <select
              id="campus"
              name="campus"
              value={formData.campus || ""}
              onChange={handleInputChange}
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

          <div className="space-y-2">
            <Label
              htmlFor="classNumber"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Users className="w-4 h-4 text-[#3396f4]" />반
            </Label>
            <Input
              type="number"
              id="classNumber"
              name="classNumber"
              value={formData.classNumber || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setFormData((prev) => ({
                  ...prev,
                  classNumber: value,
                }));
              }}
              min={1}
              max={30}
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
            />
          </div>

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
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
            />
          </div>

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
              name="birthDate"
              placeholder="YY.MM.DD"
              value={formData.birthDate}
              onChange={handleBirthDateChange}
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
                setFormData((prev) => ({
                  ...prev,
                  reason: parseInt(value),
                }))
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
                name="attendanceDate"
                value={formData.attendanceDate}
                onChange={handleInputChange}
                className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              />
              <Input
                type="time"
                name="attendanceTime"
                value={formData.attendanceTime}
                onChange={handleInputChange}
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
                name="changeDate"
                value={formData.changeDate}
                onChange={handleInputChange}
                className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
                required
              />
              <Input
                type="time"
                name="changeTime"
                value={formData.changeTime}
                onChange={handleInputChange}
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
              name="changeReason"
              value={formData.changeReason}
              onChange={(e) => handleLimitedTextChange(e, 60)}
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
