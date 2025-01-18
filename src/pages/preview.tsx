import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentDate } from "@/utils/getCurrentDate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
  absentCategoryCoordinate,
  absentDetailReasonCoordinate,
  absentTimeCoordinate,
  fontStyleOneCoordinate,
  fontStyleTwoCoordinate,
} from "./constants/coordinate";
import { useConfirmStore } from "@/store/confirmStore";

const AttendancePreview = () => {
  const router = useRouter();
  const { formData: userInput } = useConfirmStore();

  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const currentDate = getCurrentDate();

  const docsImageUrls = ["/소명확인서.png", "/소명확인서-별첨.png"];

  const A4_RATIO = 1.4142;
  const SCALE = 1.5;

  // 화면 크기 변경 감지 , 캔버스 크기 조정
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
    const canvas2 = canvas2Ref.current;
    if (!canvas1 || !canvas2) return;

    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    if (!ctx1 || !ctx2) return;

    // 캔버스 크기 설정
    canvas1.width = canvasSize.width * SCALE;
    canvas1.height = canvasSize.height * SCALE;
    canvas1.style.width = `${canvasSize.width}px`;
    canvas1.style.height = `${canvasSize.height}px`;

    canvas2.width = canvasSize.width * SCALE;
    canvas2.height = canvasSize.height * SCALE;
    canvas2.style.width = `${canvasSize.width}px`;
    canvas2.style.height = `${canvasSize.height}px`;

    // 컨텍스트 설정
    ctx1.scale(SCALE, SCALE);
    ctx2.scale(SCALE, SCALE);

    const fontSize = canvasSize.width * 0.02;
    const checkSize = canvas1.width * 0.018;

    const docsImg1 = new Image();
    docsImg1.src = docsImageUrls[0];

    const docsImg2 = new Image();
    docsImg2.src = docsImageUrls[1];

    const imgCheck = new Image();
    imgCheck.src = "/체크.png";

    const signatureImage = new Image();
    signatureImage.src = userInput.signatureUrl;

    const appendixImg = new Image();
    appendixImg.src = userInput.appendix;

    docsImg1.onload = () => {
      ctx1.drawImage(docsImg1, 0, 0, canvasSize.width, canvasSize.height);
      ctx1.font = `${fontSize + 4}px serif`;

      // [교육생 및 공가/사유 정보, 공가사유 장소, 서명 이름] 텍스트 렌더링
      const renderText = (
        coordinate: Record<string, [number, number]>,
        textData: any
      ) => {
        Object.keys(coordinate).forEach((key) => {
          const coord = coordinate[key];
          let value;
          if (key === "absentName") {
            value = textData.name;
          } else {
            value = textData[key] || "";
          }
          ctx1.fillText(
            String(value),
            coord[0] * canvasSize.width,
            coord[1] * canvasSize.height
          );
        });
      };
      renderText(fontStyleOneCoordinate, userInput);

      // [오전/오후/종일] 체크이미지 렌더링
      const absentTimeCoord = absentTimeCoordinate[userInput.absentTime];

      ctx1.drawImage(
        imgCheck,
        absentTimeCoord[0] * canvasSize.width,
        absentTimeCoord[1] * canvasSize.height,
        checkSize / SCALE,
        checkSize / SCALE
      );

      // 공가, 사유 체크이미지 렌더링
      const checkedAbsentCategory = userInput.absentCategory;
      ctx1.drawImage(
        imgCheck,
        absentCategoryCoordinate[checkedAbsentCategory][0] * canvas1.width,
        absentCategoryCoordinate[checkedAbsentCategory][1] * canvas1.height,
        checkSize / SCALE,
        checkSize / SCALE
      );

      ctx1.font = `${fontSize + 2}px serif`;

      // 공가/사유 내용 텍스트 렌더링
      const renderReason = (
        coordinates: [[number, number], [number, number]],
        maxLength: number[]
      ) => {
        const text = userInput.absentReason;
        maxLength.forEach((len, index) => {
          const lineText = text.slice(
            maxLength.slice(0, index).reduce((acc, cur) => acc + cur, 0),
            maxLength.slice(0, index + 1).reduce((acc, cur) => acc + cur, 0)
          );

          if (lineText) {
            const coord = coordinates[index];
            ctx1.fillText(
              lineText,
              coord[0] * canvasSize.width,
              coord[1] * canvasSize.height
            );
          }
        });
      };

      if (userInput.absentCategory === 0) {
        // 공가 선택시 내용
        renderReason(absentDetailReasonCoordinate, [20, 20]);
      } else if (userInput.absentCategory === 1) {
        // 사유 선택시 내용
        renderReason(
          [
            absentDetailReasonCoordinate[1],
            [
              absentDetailReasonCoordinate[1][0] - 0.29,
              absentDetailReasonCoordinate[1][1] + 0.023,
            ],
          ],
          [12, 28]
        );
      }

      // [세부내용] 텍스트 렌더링
      const renderLongText = (
        text: string,
        coordinate: [number, number],
        lineHeight: number,
        maxLength: number
      ) => {
        for (let i = 0; i < 4; i++) {
          const lineText = text.slice(i * maxLength, (i + 1) * maxLength);
          if (lineText) {
            ctx1.fillText(
              lineText,
              coordinate[0] * canvasSize.width,
              (coordinate[1] + lineHeight * i) * canvasSize.height
            );
          }
        }
      };
      renderLongText(
        userInput.absentDetail,
        fontStyleOneCoordinate.absentDetailCoordinate,
        0.02,
        20
      );

      // 서명 이미지
      const signatureWidth = canvasSize.width * 0.14;
      const signatureHeight = canvasSize.height * 0.07;
      ctx1.drawImage(
        signatureImage,
        fontStyleOneCoordinate.signature[0] * canvasSize.width,
        fontStyleOneCoordinate.signature[1] * canvasSize.height,
        signatureWidth,
        signatureHeight
      );

      // 마지막 날짜
      ctx1.font = `bold ${fontSize * 1.7}px serif`;
      Object.keys(fontStyleTwoCoordinate).forEach((key) => {
        const coord = fontStyleTwoCoordinate[key];
        const value = currentDate[key as keyof typeof currentDate] || "";
        ctx1.fillText(
          value as string,
          coord[0] * canvasSize.width,
          coord[1] * canvasSize.height
        );
      });
    };

    docsImg2.onload = () => {
      ctx2.drawImage(docsImg2, 0, 0, canvasSize.width, canvasSize.height);
      ctx2.drawImage(
        appendixImg,
        canvasSize.width * 0.1,
        canvasSize.height * 0.12,
        canvasSize.width * (3 / 4),
        canvasSize.width * (3 / 4) * (appendixImg.height / appendixImg.width)
      );
    };
  }, [canvasSize, userInput]);

  const saveImg = async () => {
    if (!canvas1Ref.current || !canvas2Ref.current) return;

    const options = {
      scale: SCALE,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    };

    try {
      const canvas1 = await html2canvas(canvas1Ref.current, options);
      const canvas2 = await html2canvas(canvas2Ref.current, options);

      if (!canvas1) return;
      if (!canvas2) return;

      const DATA_URL_SCALE = 0.8;

      const imgData = canvas1.toDataURL("image/jpeg", DATA_URL_SCALE);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = 297;

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, "", "FAST");
      pdf.addPage();

      const imgData2 = canvas2.toDataURL("image/jpeg", DATA_URL_SCALE);

      pdf.addImage(imgData2, "JPEG", 0, 0, imgWidth, imgHeight, "", "FAST");
      pdf.save(
        `${userInput.absentYear}${userInput.absentMonth}${userInput.absentDay}_출결확인서_${userInput.name}[${userInput.campus}_${userInput.class}반].pdf`
      );
    } catch {
      //
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg overflow-hidden rounded-none">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-end mb-4">
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
            <canvas
              ref={canvas2Ref}
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
