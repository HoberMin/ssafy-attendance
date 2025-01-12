import React, { useState, useRef, useEffect } from "react";
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
}

const AttendanceChangeForm = () => {
  const [formData, setFormData] = useState<FormData>({
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
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const locations = ["서울", "대전", "구미", "부울경", "대구"];
  const reasons = ["입실 미클릭", "입실 오클릭", "퇴실 미클릭", "퇴실 오클릭"];
  const periods = ["오전", "오후", "시간"];

  const { updateForm } = useAttendanceStore();

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const resizeCanvas = () => {
          const container = canvas.parentElement;
          if (container) {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width - 20;
            canvas.height = 200;
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
          }
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
      }
    }
  }, []);

  // 서명 관련 함수들...
  const getCanvasMousePosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pos = getCanvasMousePosition(e);
    setLastPos(pos);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const currentPos = getCanvasMousePosition(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();
    setLastPos(currentPos);
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      setSignatureData(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm(formData);
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
              }
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
            />
          </div>

          {/* 사유 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <ClipboardEdit className="w-4 h-4 text-[#3396f4]" />
              사유
            </Label>
            <RadioGroup
              value={formData.reason}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, reason: value }))
              }
              className="grid grid-cols-2 gap-4"
            >
              {reasons.map((reason) => (
                <div key={reason} className="flex items-center">
                  <RadioGroupItem
                    value={reason}
                    id={reason}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={reason}
                    className={`flex items-center justify-center w-full px-4 py-2 rounded-lg border-2 
                             cursor-pointer text-center transition-all duration-200
                             ${
                               formData.reason === reason
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

          {/* 출결일시 */}
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
                required
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
                required
              />
            </div>
            <RadioGroup
              value={formData.attendancePeriod}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, attendancePeriod: value }))
              }
              className="flex flex-row justify-start gap-4"
            >
              {periods.map((period) => (
                <div key={period} className="flex items-center flex-1">
                  <RadioGroupItem
                    value={period}
                    id={`attendance-${period}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`attendance-${period}`}
                    className={`flex items-center justify-center w-full px-4 py-2 rounded-lg border-2 
                             cursor-pointer text-center transition-all duration-200
                             ${
                               formData.attendancePeriod === period
                                 ? "bg-[#3396f4] text-white border-[#3396f4] shadow-md transform scale-[1.02]"
                                 : "bg-white text-gray-700 border-gray-200 hover:bg-[#3396f4]/10 hover:border-[#3396f4]/30"
                             }`}
                  >
                    {period}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 변경일시 */}
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
            <RadioGroup
              value={formData.changePeriod}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, changePeriod: value }))
              }
              className="flex flex-row justify-start gap-4"
            >
              {periods.map((period) => (
                <div key={period} className="flex items-center flex-1">
                  <RadioGroupItem
                    value={period}
                    id={`change-${period}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`change-${period}`}
                    className={`flex items-center justify-center w-full px-4 py-2 rounded-lg border-2 
                             cursor-pointer text-center transition-all duration-200
                             ${
                               formData.changePeriod === period
                                 ? "bg-[#3396f4] text-white border-[#3396f4] shadow-md transform scale-[1.02]"
                                 : "bg-white text-gray-700 border-gray-200 hover:bg-[#3396f4]/10 hover:border-[#3396f4]/30"
                             }`}
                  >
                    {period}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 변경사유 */}
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

          {/* 서명 */}
          <div className="space-y-2">
            <Label
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="서명 입력"
            >
              <Pen className="w-4 h-4 text-[#3396f4]" />
              서명
            </Label>
            <div className="border rounded-md p-2 bg-white">
              <canvas
                ref={canvasRef}
                className="border rounded cursor-crosshair w-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                aria-label="서명 캔버스"
              />
              <Button
                type="button"
                onClick={clearSignature}
                className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                variant="outline"
              >
                서명 지우기
              </Button>
            </div>
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            className="w-full bg-[#3396f4] hover:bg-[#3396f4]/80 text-white py-2 rounded-lg 
                     transition-colors duration-200 focus:ring-2 focus:ring-[#3396f4] focus:ring-offset-2"
          >
            제출하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AttendanceChangeForm;
