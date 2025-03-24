import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentDate } from "@/utils/getCurrentDate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Pencil } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  DOCS_DATE_COORD,
  TEXT_COORD,
  REASON_CHECK_COORD,
  SIGNATURE_COORD,
} from "@/constants/coordinate2";
import useAttendanceStore from "@/store/changeStore";

const AttendancePreview = () => {
  const router = useRouter();
  const { formData: userInput } = useAttendanceStore();

  const parsedUserInput = {
    ...userInput,
    attendanceDateYear: userInput.attendanceDate.slice(2, 4),
    attendanceDateMonth: userInput.attendanceDate.slice(5, 7),
    attendanceDateDay: userInput.attendanceDate.slice(8, 10),
    attendanceTimeHour: userInput.attendanceTime.slice(0, 2),
    attendanceTimeMinute: userInput.attendanceTime.slice(3, 5),
    changeDateYear: userInput.changeDate.slice(2, 4),
    changeDateMonth: userInput.changeDate.slice(5, 7),
    changeDateDay: userInput.changeDate.slice(8, 10),
    changeTimeHour: userInput.changeTime.slice(0, 2),
    changeTimeMinute: userInput.changeTime.slice(3, 5),
    requestName: userInput.name,
  };

  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const currentDate = getCurrentDate();
  const docsImageUrl = "/출결변경요청서.png";
  const A4_RATIO = 1.4142;
  const SCALE = 1.5;

  useEffect(() => {
    if (!userInput.name) {
      router.replace("/");
    }

    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerWidth * A4_RATIO;
        setCanvasSize({
          width: containerWidth,
          height: containerHeight,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    if (!canvasSize.width || !canvasSize.height) return;

    const canvas1 = canvas1Ref.current;
    if (!canvas1) return;

    const ctx1 = canvas1.getContext("2d");
    if (!ctx1) return;

    canvas1.width = canvasSize.width * SCALE;
    canvas1.height = canvasSize.height * SCALE;
    canvas1.style.width = `${canvasSize.width}px`;
    canvas1.style.height = `${canvasSize.height}px`;

    ctx1.scale(SCALE, SCALE);
    const fontSize = canvasSize.width * 0.02;
    const checkSize = canvas1.width * 0.018;

    const docsImg1 = new Image();
    docsImg1.src = docsImageUrl;

    const imgCheck = new Image();
    imgCheck.src = "/체크.png";

    const signatureImage = new Image();
    signatureImage.src = userInput.signatureData as string;

    docsImg1.onload = () => {
      ctx1.drawImage(docsImg1, 0, 0, canvasSize.width, canvasSize.height);
      ctx1.font = `${fontSize + 1}px serif`;

      // [교육생 정보]
      const renderText = (
        coordinate: Record<string, [number, number]>,
        textData: any
      ) => {
        Object.keys(coordinate).forEach((key) => {
          const coord = coordinate[key];
          let value = textData[key] || "";

          ctx1.fillText(
            String(value),
            coord[0] * canvasSize.width,
            coord[1] * canvasSize.height
          );
        });
      };
      renderText(TEXT_COORD, parsedUserInput);

      // [시스템 변경 요청 사유] 체크이미지 렌더링
      const reasonCoord = REASON_CHECK_COORD[parsedUserInput.reason];

      ctx1.drawImage(
        imgCheck,
        reasonCoord[0] * canvasSize.width,
        reasonCoord[1] * canvasSize.height,
        checkSize / SCALE,
        checkSize / SCALE
      );

      // 서명 이미지
      const signatureWidth = canvasSize.width * 0.14;
      const signatureHeight = canvasSize.height * 0.07;
      ctx1.drawImage(
        signatureImage,
        SIGNATURE_COORD[0] * canvasSize.width,
        SIGNATURE_COORD[1] * canvasSize.height,
        signatureWidth,
        signatureHeight
      );

      // 마지막 날짜
      ctx1.font = `bold ${fontSize * 1.7}px serif`;
      Object.keys(DOCS_DATE_COORD).forEach((key) => {
        const coord = DOCS_DATE_COORD[key];
        const value = currentDate[key as keyof typeof currentDate] || "";
        ctx1.fillText(
          value as string,
          coord[0] * canvasSize.width,
          coord[1] * canvasSize.height
        );
      });
    };
  }, [canvasSize, userInput]);

  const saveImg = async () => {
    if (!canvas1Ref.current) return;

    const options = {
      scale: SCALE,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    };

    try {
      const canvas1 = await html2canvas(canvas1Ref.current, options);

      if (!canvas1) return;

      const DATA_URL_SCALE = 0.8;
      const imgData = canvas1.toDataURL("image/jpeg", DATA_URL_SCALE);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = 297;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, "", "FAST");
      pdf.save(
        `${parsedUserInput.changeDateYear}${parsedUserInput.changeDateMonth}${parsedUserInput.changeDateDay}_출결변경요청서_${userInput.name}[${userInput.campus}_${userInput.classNumber}반].pdf`
      );
    } catch {
      //
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg overflow-hidden rounded-none">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-end mb-4 gap-2">
          <Button
            onClick={() => router.push("/?tab=change")}
            className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            수정하기
          </Button>
          <Button
            onClick={saveImg}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF로 저장
          </Button>
        </div>

        <div ref={containerRef} className="space-y-4">
          <div className="w-full space-y-4">
            <canvas
              ref={canvas1Ref}
              className="w-full h-auto rounded-md shadow-md"
              style={{
                display: "block",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendancePreview;
