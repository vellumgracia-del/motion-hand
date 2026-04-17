import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as drawing_utils from '@mediapipe/drawing_utils';
import * as mp_hands from '@mediapipe/hands';

const drawConnectors = drawing_utils.drawConnectors || window.drawConnectors;
const drawLandmarks = drawing_utils.drawLandmarks || window.drawLandmarks;
const HAND_CONNECTIONS = mp_hands.HAND_CONNECTIONS || window.HAND_CONNECTIONS;
import { useDrawing } from '../hooks/useDrawing';

const CanvasLayer = forwardRef(({ 
  videoRef, 
  landmarks, 
  fingerCount, 
  mode, 
  color,
  onModeChange
}, ref) => {
  const drawingCanvasRef = useRef(null);
  const skeletonCanvasRef = useRef(null);
  
  const { 
    drawStroke, 
    clearCanvas, 
    resetStroke, 
    brushSettings, 
    setBrushSettings 
  } = useDrawing(drawingCanvasRef);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    clearCanvas,
    setBrushSettings,
    brushSettings
  }));

  // Handle Mode Selection Logic
  useEffect(() => {
    if (!landmarks) {
      onModeChange({ name: "NO INPUT", color: "#64748b", icon: "help" });
      resetStroke();
      return;
    }

    let currentModeObj = { name: "STANDBY", color: "#94a3b8", icon: "hand" };
    let isDrawingStroke = false;

    if (fingerCount === 1) {
      currentModeObj = { name: "DRAWING", color: "#f43f5e", icon: "pen" };
      isDrawingStroke = true;
    } else if (fingerCount === 2) {
      currentModeObj = { name: "HUD MODE", color: "#10b981", icon: "layout" };
      isDrawingStroke = true;
    } else if (fingerCount === 3) {
      currentModeObj = { name: "ARC MODE", color: "#06b6d4", icon: "circle" };
      isDrawingStroke = true;
    } else if (fingerCount === 5) {
      currentModeObj = { name: "WIPE MEMORY", color: "#f8fafc", icon: "trash" };
      clearCanvas();
      isDrawingStroke = false;
    } else {
      currentModeObj = { name: "HOVERING", color: "#64748b", icon: "mouse-pointer" };
      isDrawingStroke = false;
      resetStroke();
    }

    onModeChange(currentModeObj);

    // Override brush settings based on mode
    let overrideSettings = null;
    if (fingerCount === 2) {
      overrideSettings = { ...brushSettings, color: "#10b981", size: brushSettings.size * 1.5 };
    } else if (fingerCount === 3) {
      overrideSettings = { ...brushSettings, color: "#06b6d4", size: brushSettings.size * 2 };
    }

    // Process Drawing & Skeleton
    const skelCtx = skeletonCanvasRef.current.getContext('2d');
    skelCtx.clearRect(0, 0, skeletonCanvasRef.current.width, skeletonCanvasRef.current.height);

    // Draw Modern MediaPipe Skeleton
    drawConnectors(skelCtx, landmarks, HAND_CONNECTIONS, {
      color: '#475569', 
      lineWidth: 2
    });
    drawLandmarks(skelCtx, landmarks, {
      color: '#cbd5e1', 
      lineWidth: 1, 
      radius: 3
    });

    // Draw on Canvas
    const indexTip = landmarks[8]; // Index Finger Tip
    const targetX = indexTip.x * drawingCanvasRef.current.width;
    const targetY = indexTip.y * drawingCanvasRef.current.height;

    const { lx, ly } = drawStroke(targetX, targetY, isDrawingStroke, overrideSettings);

    // Highlight Index Finger on Skeleton
    skelCtx.beginPath();
    skelCtx.arc(lx, ly, 8, 0, 2 * Math.PI);
    skelCtx.fillStyle = isDrawingStroke ? currentModeObj.color : 'white';
    skelCtx.fill();
    if (isDrawingStroke) {
        skelCtx.shadowBlur = 10;
        skelCtx.shadowColor = currentModeObj.color;
    }
    skelCtx.stroke();
    skelCtx.shadowBlur = 0; // Reset

  }, [landmarks, fingerCount, drawStroke, clearCanvas, resetStroke, onModeChange, brushSettings]);

  // Initial resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (drawingCanvasRef.current && skeletonCanvasRef.current) {
          const { width, height } = entry.contentRect;
          // Maintain the drawing when resizing, wait that corresponds to complex logic.
          // For now just set dimensions
          drawingCanvasRef.current.width = width;
          drawingCanvasRef.current.height = height;
          skeletonCanvasRef.current.width = width;
          skeletonCanvasRef.current.height = height;
        }
      }
    });

    if (drawingCanvasRef.current?.parentElement) {
      resizeObserver.observe(drawingCanvasRef.current.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Video Feed (Hidden, only for MediaPipe) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-20 hidden"
        autoPlay
        playsInline
        muted
      />
      
      {/* Drawing Canvas */}
      <canvas
        ref={drawingCanvasRef}
        className="absolute inset-0 w-full h-full scale-x-[-1] z-10"
        width={1280}
        height={720}
      />

      {/* Skeleton Overlay Canvas */}
      <canvas
        ref={skeletonCanvasRef}
        className="absolute inset-0 w-full h-full scale-x-[-1] z-20 pointer-events-none"
        width={1280}
        height={720}
      />
    </div>
  );
});

CanvasLayer.displayName = 'CanvasLayer';

export default CanvasLayer;
