import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Position {
  x: number;
  y: number;
}

interface SignatureCanvasProps {
  initialSignature: string | null;
  onSignatureChange: (signatureData: string | null) => void;
  width?: number;
  height?: number;
}

const SignatureCanvas = ({
  initialSignature,
  onSignatureChange,
  width = 250,
  height = 150,
}: SignatureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

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

    if (initialSignature) {
      loadSignature(initialSignature);
    }
  }, [initialSignature, height, width]);

  const loadSignature = useCallback((signatureUrl: string) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = signatureUrl;
    }
  }, []);

  const getCanvasMousePosition = (
    e: React.MouseEvent<HTMLCanvasElement>
  ): Position => {
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
      const signatureData = canvasRef.current.toDataURL();
      onSignatureChange(signatureData);
    }
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onSignatureChange(null);
    }
  };

  return (
    <div className="inline-block border rounded-md p-2 bg-white">
      <canvas
        ref={canvasRef}
        className="border rounded cursor-crosshair touch-none"
        style={{ width: `${width}px`, height: `${height}px` }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
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
  );
};

export default SignatureCanvas;
