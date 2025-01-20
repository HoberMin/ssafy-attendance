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
  FileText,
  MessageSquare,
  Building,
  Pen,
  FileImage,
} from "lucide-react";
import { useRouter } from "next/router";
import { useConfirmStore } from "@/store/confirmStore";

interface FormData {
  location: string;
  absentCategory: string;
  classNumber: string;
  name: string;
  birthDate: string;
  absenceDate: string;
  category: string;
  reason: string;
  details: string;
  place: string;
}

const AbsenceForm = () => {
  const router = useRouter();
  const { formData: userInput, setFormData: setConfirmForm } =
    useConfirmStore();

  // 초기값 설정 함수
  const getInitialFormData = () => {
    if (!userInput.name) {
      return {
        location: "",
        classNumber: "",
        name: "",
        birthDate: "",
        absenceDate: "",
        absentCategory: "공가",
        category: "오전",
        reason: "",
        details: "",
        place: "",
      };
    }

    // Zustand store 데이터로부터 폼 데이터 변환
    const [year, month, day] = userInput.birthday.split("-");
    return {
      location: userInput.campus,
      classNumber: userInput.class,
      name: userInput.name,
      birthDate: `${year}.${month}.${day}`,
      absenceDate: `20${userInput.absentYear}-${userInput.absentMonth.padStart(
        2,
        "0"
      )}-${userInput.absentDay.padStart(2, "0")}`,
      absentCategory: userInput.absentCategory === 0 ? "공가" : "사유",
      category: (() => {
        switch (userInput.absentTime) {
          case 0:
            return "오전";
          case 1:
            return "오후";
          case 2:
            return "종일";
          default:
            return "오전";
        }
      })(),
      reason: userInput.absentReason,
      details: userInput.absentDetail,
      place: userInput.absentPlace,
    };
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(
    userInput.signatureUrl || null
  );
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const locations = ["서울", "대전", "구미", "부울경", "광주"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "name" && value.length > 5) {
      return;
    }

    if (name === "birthDate") {
      // Remove any non-digit characters first
      const numbers = value.replace(/\D/g, "");

      // Add dots after every 2 digits
      let formattedDate = "";
      for (let i = 0; i < numbers.length && i < 6; i++) {
        if (i === 2 || i === 4) {
          formattedDate += ".";
        }
        formattedDate += numbers[i];
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const maxLength = name === "reason" ? 40 : 80;

    if (value.length <= maxLength) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = 250;
        canvas.height = 150;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, []);

  // 서명 이미지 초기 로드
  useEffect(() => {
    if (canvasRef.current && userInput.signatureUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = userInput.signatureUrl;
      }
    }
  }, [userInput.signatureUrl]);

  // 증빙서류 이미지 초기 로드
  useEffect(() => {
    if (userInput.appendix) {
      const convertBase64ToFile = async (base64String: string) => {
        const response = await fetch(base64String);
        const blob = await response.blob();
        return new File([blob], "appendix.png", { type: "image/png" });
      };

      convertBase64ToFile(userInput.appendix)
        .then((file) => setDocumentFile(file))
        .catch((error) =>
          console.error("Error converting base64 to file:", error)
        );
    }
  }, [userInput.appendix]);

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
    setIsDrawing(false);
    if (canvasRef.current) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const convertFileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    };

    const [absenceYear, absenceMonth, absenceDay] = formData.absenceDate
      .split("-")
      .map(String);

    const getAbsentTime = (category: string): number => {
      switch (category) {
        case "오전":
          return 0;
        case "오후":
          return 1;
        case "종일":
          return 2;
        default:
          return 0;
      }
    };

    const getAbsentCategory = (category: string): number => {
      switch (category) {
        case "공가":
          return 0;
        case "사유":
          return 1;
        default:
          return 0;
      }
    };

    try {
      let fileBase64 = "";
      if (documentFile) {
        fileBase64 = await convertFileToBase64(documentFile);
      }

      const transformedData = {
        name: formData.name,
        birthday: formData.birthDate.replace(/\./g, "-"),
        absentYear: absenceYear.slice(2, 4),
        absentMonth: absenceMonth,
        absentDay: absenceDay,
        absentTime: getAbsentTime(formData.category),
        absentCategory: getAbsentCategory(formData.absentCategory),
        absentReason: formData.reason.replaceAll("\n", " "),
        absentDetail: formData.details.replaceAll("\n", " "),
        absentPlace: formData.place,
        signatureUrl: signatureData || "",
        campus: `${formData.location}`,
        class: formData.classNumber,
        appendix: fileBase64,
      };

      setConfirmForm(transformedData);
      router.push("/preview");
    } catch (error) {
      console.error("파일 변환 중 에러 발생:", error);
    }
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
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
              aria-required="true"
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
              aria-label="반 번호 입력"
            >
              <Users className="w-4 h-4 text-[#3396f4]" />반
            </Label>
            <Input
              type="number"
              id="classNumber"
              name="classNumber"
              value={formData.classNumber}
              onChange={handleInputChange}
              required
              aria-required="true"
              min={1}
              max={23}
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
            />
          </div>

          {/* 이름 */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="성명 입력"
            >
              <User className="w-4 h-4 text-[#3396f4]" />
              성명
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              minLength={2}
              maxLength={5}
              value={formData.name}
              onChange={handleInputChange}
              required
              aria-required="true"
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
            />
          </div>

          {/* 생년월일 */}
          <div className="space-y-2">
            <Label
              htmlFor="birthDate"
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="생년월일 입력"
            >
              <Calendar className="w-4 h-4 text-[#3396f4]" />
              생년월일
            </Label>
            <Input
              type="text"
              id="birthDate"
              name="birthDate"
              placeholder="YY.MM.DD"
              value={formData.birthDate}
              onChange={handleInputChange}
              required
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
            />
          </div>

          {/* 결석일시 */}
          <div className="space-y-2">
            <Label
              htmlFor="absenceDate"
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="결석일시 선택"
            >
              <Calendar className="w-4 h-4 text-[#3396f4]" />
              결석일시
            </Label>
            <Input
              type="date"
              id="absenceDate"
              name="absenceDate"
              value={formData.absenceDate}
              onChange={handleInputChange}
              min="1900-01-01"
              max="2099-12-31"
              required
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
            />
          </div>

          {/* 장소 */}
          <div className="space-y-2">
            <Label
              htmlFor="place"
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="장소 입력"
            >
              <Building className="w-4 h-4 text-[#3396f4]" />
              장소
            </Label>
            <Input
              type="text"
              id="place"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              required
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
            />
          </div>

          {/* 분류 부분 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-[#3396f4]" />
              분류
            </Label>
            <RadioGroup
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              className="flex flex-row justify-start gap-6"
              aria-label="결석 분류 선택"
            >
              {["오전", "오후", "종일"].map((category) => (
                <div key={category} className="flex items-center flex-1">
                  <RadioGroupItem
                    value={category}
                    id={category}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={category}
                    className={`flex items-center justify-center w-full px-4 py-2 rounded-lg border-2
                     cursor-pointer text-center transition-all duration-200
                     ${
                       formData.category === category
                         ? "bg-[#3396f4] text-white border-[#3396f4] shadow-md transform scale-[1.02]"
                         : "bg-white text-gray-700 border-gray-200 hover:bg-[#3396f4]/10 hover:border-[#3396f4]/30"
                     }`}
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-[#3396f4]" />
              공가사유
            </Label>
            <RadioGroup
              value={formData.absentCategory}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, absentCategory: value }))
              }
              className="flex justify-start gap-6"
              aria-label="결석 분류 선택"
            >
              {["공가", "사유"].map((category) => (
                <div key={category} className="flex items-center">
                  <RadioGroupItem
                    value={category}
                    id={category}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={category}
                    className={`flex items-center justify-center w-full px-4 py-2 rounded-lg border-2
                     cursor-pointer text-center transition-all duration-200
                     ${
                       formData.absentCategory === category
                         ? "bg-[#3396f4] text-white border-[#3396f4] shadow-md transform scale-[1.02]"
                         : "bg-white text-gray-700 border-gray-200 hover:bg-[#3396f4]/10 hover:border-[#3396f4]/30"
                     }`}
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="reason"
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="결석 사유 입력"
            >
              <FileText className="w-4 h-4 text-[#3396f4]" />
              사유 (최대 30자)
            </Label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleTextareaChange}
              className="w-full p-2 border rounded-md min-h-[80px] resize-none 
                       focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
              aria-required="true"
              maxLength={30}
            />
            <div className="text-sm text-gray-500 text-right">
              {formData.reason.length}/30자
            </div>
          </div>

          {/* 세부내용 */}
          <div className="space-y-2">
            <Label
              htmlFor="details"
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="세부내용 입력"
            >
              <MessageSquare className="w-4 h-4 text-[#3396f4]" />
              세부내용 (최대 80자)
            </Label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleTextareaChange}
              className="w-full p-2 border rounded-md min-h-[120px] resize-none 
                       focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
              aria-required="true"
              maxLength={80}
            />
            <div className="text-sm text-gray-500 text-right">
              {formData.details.length}/80자
            </div>
          </div>

          {/* 서명 부분 */}
          <div className="space-y-2">
            <Label
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="서명 입력"
            >
              <Pen className="w-4 h-4 text-[#3396f4]" />
              서명
            </Label>
            <div className="inline-block border rounded-md p-2 bg-white">
              <canvas
                ref={canvasRef}
                className="border rounded cursor-crosshair touch-none"
                style={{ width: "250px", height: "150px" }}
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

          {/* 증빙서류 */}
          <div className="space-y-2">
            <Label
              htmlFor="document"
              className="flex items-center gap-2 text-sm font-medium"
              aria-label="증빙서류 업로드"
            >
              <FileImage className="w-4 h-4 text-[#3396f4]" />
              증빙서류
            </Label>
            <Input
              type="file"
              id="document"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setDocumentFile(e.target.files[0]);
                }
              }}
              required
              aria-required="true"
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-[20px] bg-[#3396f4] hover:bg-[#3396f4]/80 text-white py-2 rounded-lg 
                     transition-colors duration-200 focus:ring-2 focus:ring-[#3396f4] focus:ring-offset-2"
          >
            양식 미리보기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AbsenceForm;
