import { useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface UseSignatureProps {
  initialSignature?: string;
  width?: number;
  height?: number;
}

const useSignature = ({
  initialSignature,
  width = 250,
  height = 150,
}: UseSignatureProps = {}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(
    initialSignature || null
  );
  const [lastPos, setLastPos] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined") return;

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = width;
        canvas.height = height;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }

      // 초기 서명 로드
      if (initialSignature) {
        loadSignature(initialSignature);
      }
    }
  }, [initialSignature, width, height]);

  const loadSignature = (signatureUrl: string) => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setSignatureData(signatureUrl);
      };
      img.src = signatureUrl;
    }
  };

  const getCanvasMousePosition = (
    e: React.MouseEvent<HTMLCanvasElement>
  ): Position => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined" || !canvasRef.current)
      return { x: 0, y: 0 };

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
    setLastPos(getCanvasMousePosition(e));
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

  return {
    canvasRef,
    signatureData,
    startDrawing,
    draw,
    stopDrawing,
    clearSignature,
    loadSignature,
  };
};

export default useSignature;
