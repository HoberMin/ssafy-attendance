import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/router";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentDate } from "@/utils/getCurrentDate";
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
  const [fontStyleOne, setFontStyleOne] = useState<string>("");
  const [fontStyleTwo, setFontStyleTwo] = useState<string>("");
  const [fontStyleReason, setFontStyleReason] = useState<string>("");
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const currentDate = getCurrentDate();

  const docsImageUrls = ["/소명확인서.png", "/소명확인서-별첨.png"];

  const A4_RATIO = 1.4142;

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
    canvas1.width = canvasSize.width * 2;
    canvas1.height = canvasSize.height * 2;
    canvas1.style.width = `${canvasSize.width}px`;
    canvas1.style.height = `${canvasSize.height}px`;

    canvas2.width = canvasSize.width * 2;
    canvas2.height = canvasSize.height * 2;
    canvas2.style.width = `${canvasSize.width}px`;
    canvas2.style.height = `${canvasSize.height}px`;

    // 컨텍스트 설정
    ctx1.scale(2, 2);
    ctx2.scale(2, 2);

    const fontSize = Math.max(canvasSize.width * 0.02, 12);
    const checkSize = canvas1.width * 0.018;

    setFontStyleOne(`${fontSize + 4}px serif`);
    setFontStyleTwo(`bold ${fontSize * 1.7}px serif`);
    setFontStyleReason(`${fontSize + 2}px serif`);

    const docsImg1 = new Image();
    docsImg1.src = docsImageUrls[0];

    const imgCheck = new Image();
    imgCheck.src = "/체크.png";

    const signatureImage = new Image();
    signatureImage.src = userInput.signatureUrl;

    docsImg1.onload = () => {
      ctx1.drawImage(docsImg1, 0, 0, canvasSize.width, canvasSize.height);
      ctx1.font = fontStyleOne;

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
          console.log(key, value);
          ctx1.fillText(
            String(value),
            coord[0] * canvasSize.width,
            coord[1] * canvasSize.height
          );
        });
        console.log("_");
      };
      renderText(fontStyleOneCoordinate, userInput);

      // [오전/오후/종일] 체크이미지 렌더링
      const absentTimeCoord = absentTimeCoordinate[userInput.absentTime];
      ctx1.drawImage(
        imgCheck,
        absentTimeCoord[0] * canvasSize.width,
        absentTimeCoord[1] * canvasSize.height,
        checkSize / 2,
        checkSize / 2
      );

      // 공가, 사유 체크이미지 렌더링
      const checkedAbsentCategory = userInput.absentCategory;
      ctx1.drawImage(
        imgCheck,
        absentCategoryCoordinate[checkedAbsentCategory][0] * canvas1.width,
        absentCategoryCoordinate[checkedAbsentCategory][1] * canvas1.height,
        checkSize / 2,
        checkSize / 2
      );

      ctx1.font = fontStyleReason;

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
      ctx1.font = fontStyleTwo;
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

    const docsImg2 = new Image();
    docsImg2.src = docsImageUrls[1];
    docsImg2.onload = () => {
      ctx2.drawImage(docsImg2, 0, 0, canvasSize.width, canvasSize.height);

      const appendixImg = new Image();
      appendixImg.src = userInput.appendix;
      ctx2.drawImage(
        appendixImg,
        canvasSize.width * 0.1,
        canvasSize.height * 0.12,
        canvasSize.width * (3 / 4),
        canvasSize.width * (3 / 4) * (appendixImg.height / appendixImg.width)
      );
    };
  }, [canvasSize, userInput, fontStyleOne, fontStyleTwo]);

  const saveImg = () => {
    if (!canvas1Ref.current || !canvas2Ref.current) return;

    html2canvas(canvas1Ref.current, {
      scale: 2,
    }).then(() => {
      const canvas = canvas1Ref.current;
      if (!canvas) return;

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = 297;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.addPage();

      const canvas2 = canvas2Ref.current;
      if (!canvas2) return;

      const imgData2 = canvas2.toDataURL("image/png", 1.0);

      pdf.addImage(imgData2, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `${userInput.absentYear}${userInput.absentMonth}${userInput.absentDay}_출결확인서_${userInput.name}[${userInput.class}].pdf`
      );
    });
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
