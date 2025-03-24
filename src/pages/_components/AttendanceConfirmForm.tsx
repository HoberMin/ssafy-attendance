import React, { useState, useEffect } from "react";
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
import {
  useConfirmStore,
  TransformedData,
  initialState,
} from "@/store/confirmStore";
import { convertBase64ToFile, convertFileToBase64 } from "@/lib/utils";
import SignatureCanvas from "./SignatureCanvas";

interface ExtendedTransformedData extends TransformedData {
  absenceDate: string;
}

interface Position {
  x: number;
  y: number;
}

const AbsenceForm = () => {
  const router = useRouter();
  const { formData: userInput, setFormData: setConfirmForm } =
    useConfirmStore();

  const [signatureData, setSignatureData] = useState<string | null>(
    userInput.signatureUrl || null
  );

  const getInitialFormData = (): ExtendedTransformedData => {
    if (!userInput.name) {
      return {
        ...initialState,
        absentTime: 0,
        absentCategory: 0,
        absenceDate: "",
      };
    }

    const absenceDate =
      userInput.absentYear && userInput.absentMonth && userInput.absentDay
        ? `20${userInput.absentYear}-${userInput.absentMonth}-${userInput.absentDay}`
        : "";

    return {
      ...userInput,
      signatureUrl: userInput.signatureUrl || "",
      appendix: userInput.appendix || "",
      absenceDate,
    };
  };

  const [formData, setFormData] = useState<ExtendedTransformedData>(
    getInitialFormData()
  );
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const locations = ["서울", "대전", "구미", "부울경", "광주"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (value.length > 5) return;

      if (!/^[ㄱ-ㅎㅏ-ㅣ가-힣]*$/.test(value)) return;

      setFormData((prev) => ({ ...prev, name: value }));
      return;
    }

    if (name === "class") {
      const numValue = value.replace(/\D/g, "");
      const num = parseInt(numValue);
      if (numValue === "" || (num >= 1 && num <= 23)) {
        setFormData((prev) => ({ ...prev, class: numValue }));
      }
      return;
    }

    if (name === "birthday") {
      const numbers = value.replace(/\D/g, "");
      const formattedDate = numbers
        .slice(0, 6)
        .split("")
        .reduce((acc, digit, i) => {
          if (i === 2 || i === 4) return `${acc}-${digit}`;
          return acc + digit;
        }, "");

      setFormData((prev) => ({ ...prev, birthday: formattedDate }));
      return;
    }

    if (name === "absentPlace") {
      if (value.length <= 30) {
        setFormData((prev) => ({ ...prev, absentPlace: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const maxLength = name === "absentReason" ? 30 : 120;

    if (value.length <= maxLength) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (userInput.appendix) {
      convertBase64ToFile(userInput.appendix)
        .then(setDocumentFile)
        .catch((error) =>
          console.error("Error converting base64 to file:", error)
        );
    }
  }, [userInput.appendix]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const fileBase64 = documentFile
        ? await convertFileToBase64(documentFile)
        : "";

      // 날짜를 분리
      const date = new Date(formData.absenceDate);
      const year = date.getFullYear().toString().slice(2); // YY
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // MM
      const day = date.getDate().toString().padStart(2, "0"); // DD

      const transformedData: TransformedData = {
        ...formData,
        absentYear: year,
        absentMonth: month,
        absentDay: day,
        signatureUrl: signatureData || "",
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
              htmlFor="campus"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <MapPin className="w-4 h-4 text-[#3396f4]" />
              지역
            </Label>
            <select
              id="campus"
              name="campus"
              value={formData.campus}
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

          {/* 반 번호 */}
          <div className="space-y-2">
            <Label
              htmlFor="class"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Users className="w-4 h-4 text-[#3396f4]" />반
            </Label>
            <Input
              type="number"
              id="class"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              required
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
              required
              minLength={2}
              maxLength={5}
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
            />
          </div>

          {/* 생년월일 */}
          <div className="space-y-2">
            <Label
              htmlFor="birthday"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Calendar className="w-4 h-4 text-[#3396f4]" />
              생년월일
            </Label>
            <Input
              type="text"
              id="birthday"
              name="birthday"
              placeholder="YY-MM-DD"
              value={formData.birthday}
              onChange={handleInputChange}
              required
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
            />
          </div>

          {/* 결석일시 변경 */}
          <div className="space-y-2">
            <Label
              htmlFor="absenceDate"
              className="flex items-center gap-2 text-sm font-medium"
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
              required
              className="focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
            />
          </div>

          {/* 장소 */}
          <div className="space-y-2">
            <Label
              htmlFor="absentPlace"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Building className="w-4 h-4 text-[#3396f4]" />
              장소
            </Label>
            <Input
              type="text"
              id="absentPlace"
              name="absentPlace"
              value={formData.absentPlace}
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
              value={String(formData.absentTime)}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  absentTime: Number(value),
                }))
              }
              className="flex flex-row justify-start gap-6"
            >
              {[
                { value: "0", label: "오전" },
                { value: "1", label: "오후" },
                { value: "2", label: "종일" },
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center flex-1">
                  <RadioGroupItem
                    value={value}
                    id={value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={value}
                    className={`flex items-center justify-center w-full px-4 py-2 rounded-lg border-2
                     cursor-pointer text-center transition-all duration-200
                     ${
                       String(formData.absentTime) === value
                         ? "bg-[#3396f4] text-white border-[#3396f4] shadow-md transform scale-[1.02]"
                         : "bg-white text-gray-700 border-gray-200 hover:bg-[#3396f4]/10 hover:border-[#3396f4]/30"
                     }`}
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 공가사유 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-[#3396f4]" />
              공가사유
            </Label>
            <RadioGroup
              value={String(formData.absentCategory)}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  absentCategory: Number(value),
                }))
              }
              className="flex justify-start gap-6"
            >
              {[
                { value: "0", label: "공가" },
                { value: "1", label: "사유" },
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center">
                  <RadioGroupItem
                    value={value}
                    id={`category-${value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`category-${value}`}
                    className={`flex items-center justify-center w-full px-4 py-2 rounded-lg border-2
                     cursor-pointer text-center transition-all duration-200
                     ${
                       String(formData.absentCategory) === value
                         ? "bg-[#3396f4] text-white border-[#3396f4] shadow-md transform scale-[1.02]"
                         : "bg-white text-gray-700 border-gray-200 hover:bg-[#3396f4]/10 hover:border-[#3396f4]/30"
                     }`}
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* 사유 */}
          <div className="space-y-2">
            <Label
              htmlFor="absentReason"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FileText className="w-4 h-4 text-[#3396f4]" />
              사유 (최대 30자)
            </Label>
            <textarea
              id="absentReason"
              name="absentReason"
              value={formData.absentReason}
              onChange={handleTextareaChange}
              className="w-full p-2 border rounded-md min-h-[80px] resize-none 
                       focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
              maxLength={30}
            />
            <div className="text-sm text-gray-500 text-right">
              {formData.absentReason.length}/30자
            </div>
          </div>

          {/* 세부내용 */}
          <div className="space-y-2">
            <Label
              htmlFor="absentDetail"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <MessageSquare className="w-4 h-4 text-[#3396f4]" />
              세부내용 (최대 120자)
            </Label>
            <textarea
              id="absentDetail"
              name="absentDetail"
              value={formData.absentDetail}
              onChange={handleTextareaChange}
              className="w-full p-2 border rounded-md min-h-[120px] resize-none 
                      focus:ring-2 focus:ring-[#3396f4] focus:border-[#3396f4]"
              required
              maxLength={120}
            />
            <div className="text-sm text-gray-500 text-right">
              {formData.absentDetail.length}/120자
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Pen className="w-4 h-4 text-[#3396f4]" />
              서명
            </Label>
            <SignatureCanvas
              initialSignature={userInput.signatureUrl || null}
              onSignatureChange={setSignatureData}
              width={250}
              height={150}
            />
          </div>

          {/* 증빙서류 */}
          <div className="space-y-2">
            <Label
              htmlFor="document"
              className="flex items-center gap-2 text-sm font-medium"
            >
              <FileImage className="w-4 h-4 text-[#3396f4]" />
              증빙서류
            </Label>
            <div className="space-y-2">
              <Input
                type="file"
                id="document"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    setDocumentFile(e.target.files[0]);
                  }
                }}
                required={!documentFile}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => document.getElementById("document")?.click()}
                  variant="outline"
                  className="bg-white hover:bg-gray-50"
                >
                  <FileImage className="w-4 h-4 mr-2" />
                  파일 등록
                </Button>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  {documentFile ? (
                    <>
                      <FileImage className="w-4 h-4" />
                      {documentFile.name === "appendix.png"
                        ? "출결증명 서류"
                        : documentFile.name}
                    </>
                  ) : (
                    "증명서류를 등록해야합니다"
                  )}
                </div>
              </div>
            </div>
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
