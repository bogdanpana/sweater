"use client";

import { useState, useRef, useEffect } from "react";

interface ImageEditorProps {
  imageUrl: string;
  frameUrl: string;
  onSave: (framedImageUrl: string) => void;
  onCancel: () => void;
}

export default function ImageEditor({ imageUrl, frameUrl, onSave, onCancel }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    const frame = new Image();
    
    img.crossOrigin = "anonymous";
    frame.crossOrigin = "anonymous";
    
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
      // Set initial scale to fit frame
      const canvas = canvasRef.current;
      if (canvas && frameRef.current) {
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        setScale(Math.max(scaleX, scaleY) * 1.1); // Slightly larger to allow cropping
      }
    };
    
    frame.onload = () => {
      frameRef.current = frame;
      setFrameLoaded(true);
    };
    
    img.src = imageUrl;
    frame.src = frameUrl;
  }, [imageUrl, frameUrl]);

  useEffect(() => {
    if (imgLoaded && frameLoaded) {
      drawCanvas();
    }
  }, [imgLoaded, frameLoaded, scale, position]);

  function drawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current || !frameRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image with transformations
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    ctx.drawImage(
      imgRef.current,
      -imgRef.current.width / 2,
      -imgRef.current.height / 2
    );
    ctx.restore();

    // Draw frame on top
    ctx.drawImage(frameRef.current, 0, 0, canvas.width, canvas.height);
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.5, Math.min(3, prev * delta)));
  }

  function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onSave(url);
      }
    }, "image/png", 0.95);
  }

  if (!imgLoaded || !frameLoaded) {
    return (
      <div style={{ padding: "40px", textAlign: "center", opacity: 0.7 }}>
        ⏳ Se încarcă...
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: "14px", opacity: 0.8, marginBottom: 12 }}>
          🎯 Ajustează poza: glisează pentru poziționare, zoom cu scroll
        </p>
        <div style={{
          display: "inline-block",
          borderRadius: 16,
          overflow: "hidden",
          border: "2px solid rgba(220, 38, 38, 0.3)",
          background: "#0b0f14",
          position: "relative"
        }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "auto",
              cursor: isDragging ? "grabbing" : "grab",
              display: "block"
            }}
          />
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        gap: 12,
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
          className="christmas-button"
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            minHeight: "44px"
          }}
        >
          ➖ Zoom Out
        </button>
        <button
          onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}
          className="christmas-button"
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            minHeight: "44px"
          }}
        >
          ➕ Zoom In
        </button>
        <button
          onClick={() => setPosition({ x: 0, y: 0 })}
          className="christmas-button"
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            minHeight: "44px",
            background: "rgba(10, 14, 19, 0.6)"
          }}
        >
          🔄 Reset
        </button>
      </div>

      <div style={{ 
        display: "flex", 
        gap: 12,
        marginTop: 20,
        justifyContent: "center"
      }}>
        <button
          onClick={handleSave}
          className="christmas-button"
          style={{
            flex: 1,
            maxWidth: "300px",
            fontSize: "clamp(16px, 4vw, 18px)",
            padding: "16px 24px",
            minHeight: "56px"
          }}
        >
          ✅ Salvează și continuă
        </button>
        <button
          onClick={onCancel}
          className="christmas-button"
          style={{
            flex: 1,
            maxWidth: "300px",
            fontSize: "clamp(16px, 4vw, 18px)",
            padding: "16px 24px",
            minHeight: "56px",
            background: "rgba(10, 14, 19, 0.6)",
            border: "2px solid rgba(220, 38, 38, 0.3)"
          }}
        >
          Anulează
        </button>
      </div>
    </div>
  );
}

