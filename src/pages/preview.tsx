import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/router";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IFUserInfo {
  name: string;
  birthday: string;
  absentYear: string;
  absentMonth: string;
  absentDay: string;
  absentTime: number;
  absentCategory: number;
  absentReason: string;
  absentDetail: string;
  absentPlace: string;
  signatureUrl: string;
  campus: string;
  class: string;
  appendix: string;
}

const AttendancePreview = () => {
  const router = useRouter();

  const today = new Date();
  const currentYear = String(today.getFullYear()).slice(2, 4);
  const currentMonth = String(today.getMonth() + 1);
  const currentDay = String(today.getDate()).padStart(2, "0");
  const currentDate = {
    currentYear: currentYear,
    currentMonth: currentMonth,
    currentDay: currentDay,
  };

  const userInput = {
    name: "홍길동",
    birthday: "1995-05-15",
    absentYear: "25",
    absentMonth: "01",
    absentDay: "11",
    absentTime: 1,
    absentCategory: 1,
    absentReason:
      "병원 방문\n가족 치료병원 방문\n가족 치료병원 방문\n가족 치료병원 방문\n가족 치료병원 방문\n가족 치료병원 방문\n가족 치료병원 방문\n가족 치료병원 방문\n가족 치료병원 방문\n가족 치료",
    // 세부내용 24자 이후 줄넘김
    absentDetail:
      "갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉궑뷁갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉갉",
    absentPlace: "서울 강남구",
    signatureUrl: "/체크.png",
    campus: "서울 캠퍼스",
    class: "3학년 1반",
    appendix: "/체크.png",
  };

  const docsImageUrls = ["/소명확인서.png", "/소명확인서-별첨.png"];

  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fontStyleOne, setFontStyleOne] = useState<string>("");
  const [fontStyleTwo, setFontStyleTwo] = useState<string>("");
  const [fontStyleReason, setFontStyleReason] = useState<string>("");
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const A4_RATIO = 1.4142;

  const fontStyleTwoCoordinate: Record<string, [number, number]> = {
    currentYear: [0.374, 0.9005],
    currentMonth: [0.485, 0.9005],
    currentDay: [0.585, 0.9005],
  };

  const fontStyleOneCoordinate: Record<string, [number, number]> = {
    name: [0.32, 0.2293],
    birthday: [0.66, 0.229],
    absentYear: [0.354, 0.273],
    absentMonth: [0.444, 0.273],
    absentDay: [0.52, 0.273],

    absentPlace: [0.32, 0.647],
    signature: [0.8, 0.64],
    absentName: [0.32, 0.68],
  };

  // 공가/사유 체크박스
  const absentCategoryCoordinate = [
    [0.102, 0.201],
    [0.102, 0.2223],
  ];
  // 공가/사유 내용
  const absentDetailReasonCoordinate = [
    [0.31, 0.413],
    [0.53, 0.455],
  ];

  const absentTime = [
    [0.6075, 0.26],
    [0.7, 0.26],
    [0.7915, 0.26],
  ];

  const absentDetailCoordinate = [0.35, 0.55];

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

    const checkSize = canvas1.width * 0.018;

    const fontSize = Math.max(canvasSize.width * 0.02, 12);

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

      // 텍스트 렌더링
      Object.keys(fontStyleOneCoordinate).forEach((key) => {
        const coord = fontStyleOneCoordinate[key];
        const value = userInput[key as keyof IFUserInfo] || "";
        ctx1.fillText(
          value as string,
          coord[0] * canvasSize.width,
          coord[1] * canvasSize.height
        );
      });
      const absentReaseon1 = userInput.absentDetail.slice(0, 20);
      const absentReaseon2 = userInput.absentDetail.slice(20, 40);
      const absentReaseon3 = userInput.absentDetail.slice(40, 60);
      const absentReaseon4 = userInput.absentDetail.slice(60, 80);

      ctx1.fillText(
        absentReaseon1,
        absentDetailCoordinate[0] * canvasSize.width,
        absentDetailCoordinate[1] * canvasSize.height
      );
      ctx1.fillText(
        absentReaseon2,
        absentDetailCoordinate[0] * canvasSize.width,
        (absentDetailCoordinate[1] + 0.02) * canvasSize.height
      );
      ctx1.fillText(
        absentReaseon3,
        absentDetailCoordinate[0] * canvasSize.width,
        (absentDetailCoordinate[1] + 0.04) * canvasSize.height
      );
      ctx1.fillText(
        absentReaseon4,
        absentDetailCoordinate[0] * canvasSize.width,
        (absentDetailCoordinate[1] + 0.06) * canvasSize.height
      );

      ctx1.fillText(
        userInput.name,
        fontStyleOneCoordinate.absentName[0] * canvasSize.width,
        fontStyleOneCoordinate.absentName[1] * canvasSize.height
      );

      const checkedAbsentCategory = userInput.absentCategory;
      ctx1.drawImage(
        imgCheck,
        absentCategoryCoordinate[checkedAbsentCategory][0] * canvas1.width,
        absentCategoryCoordinate[checkedAbsentCategory][1] * canvas1.height,
        checkSize / 2,
        checkSize / 2
      );

      // 공가/사유 박스
      ctx1.font = fontStyleReason;
      if (userInput.absentCategory === 0) {
        // absentReason
        const absentReason1 = userInput.absentReason.slice(0, 20);
        const absentReason2 = userInput.absentReason.slice(20, 40);

        ctx1.fillText(
          absentReason1,
          absentDetailReasonCoordinate[userInput.absentCategory][0] *
            canvasSize.width,
          absentDetailReasonCoordinate[userInput.absentCategory][1] *
            canvasSize.height
        );
        ctx1.fillText(
          absentReason2,
          absentDetailReasonCoordinate[userInput.absentCategory][0] *
            canvasSize.width,
          (absentDetailReasonCoordinate[userInput.absentCategory][1] + 0.02) *
            canvasSize.height
        );
      } else if (userInput.absentCategory === 1) {
        const absentReason1 = userInput.absentReason.slice(0, 12);
        const absentReason2 = userInput.absentReason.slice(12, 40);

        ctx1.fillText(
          absentReason1,
          absentDetailReasonCoordinate[userInput.absentCategory][0] *
            canvasSize.width,
          absentDetailReasonCoordinate[userInput.absentCategory][1] *
            canvasSize.height
        );
        ctx1.fillText(
          absentReason2,
          (absentDetailReasonCoordinate[userInput.absentCategory][0] - 0.29) *
            canvasSize.width,
          (absentDetailReasonCoordinate[userInput.absentCategory][1] + 0.023) *
            canvasSize.height
        );
      }

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

      // 체크 마크
      const absentTimeCoord = absentTime[userInput.absentTime];
      ctx1.drawImage(
        imgCheck,
        absentTimeCoord[0] * canvasSize.width,
        absentTimeCoord[1] * canvasSize.height,
        checkSize / 2,
        checkSize / 2
      );
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
        canvasSize.width / 2,
        canvasSize.height / 2
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

      //
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
