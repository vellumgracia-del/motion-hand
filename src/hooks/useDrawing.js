import { useRef, useCallback, useState } from 'react';
import { lerp } from '../utils/fingerDetection';

export function useDrawing(canvasRef) {
  const [brushSettings, setBrushSettings] = useState({
    size: 6,
    color: '#f43f5e', // Default rose
    opacity: 1
  });
  
  // State to track if we're currently in a continuous stroke
  const [isDrawing, setIsDrawing] = useState(false);

  // Store the previous interpolation point to draw continuous lines
  const prevPointRef = useRef({ x: 0, y: 0, initialized: false });

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Reset previous point so a line doesn't connect from the wipe
    prevPointRef.current.initialized = false;
  }, [canvasRef]);

  const drawStroke = useCallback((targetX, targetY, isDrawingInput, overrideSettings = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Apply lerp smoothing
    let startX = prevPointRef.current.x;
    let startY = prevPointRef.current.y;
    
    if (!prevPointRef.current.initialized) {
      startX = targetX;
      startY = targetY;
      prevPointRef.current.initialized = true;
    }
    
    const smoothFactor = 0.25; // 0.1-0.3 is ideal for drawing
    const currentX = lerp(startX, targetX, smoothFactor);
    const currentY = lerp(startY, targetY, smoothFactor);
    
    setIsDrawing(isDrawingInput);

    if (isDrawingInput) {
      const activeSettings = overrideSettings || brushSettings;
      
      ctx.beginPath();
      ctx.lineWidth = activeSettings.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = `rgba(${hexToRgb(activeSettings.color)}, ${activeSettings.opacity})`;
      
      // Modern flat stroke aesthetic - using very slight blur to soften edges but not glow
      ctx.shadowBlur = 2; 
      ctx.shadowColor = `rgba(${hexToRgb(activeSettings.color)}, 0.4)`;
      
      ctx.moveTo(startX, startY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    } else {
        // If we are just hovering, don't draw, but reset initialization 
        // if we lift the "brush" so the next stroke doesn't connect magically
        // Actually, if we just want to track position while hovering, 
        // we can keep it connected but we'll reset when mode changes in CanvasLayer
    }
    
    // Save current as previous
    prevPointRef.current = { x: currentX, y: currentY, initialized: true };
    
    return { lx: currentX, ly: currentY }; // return the smoothed coordinates for skeleton rendering
  }, [canvasRef, brushSettings]);

  const resetStroke = useCallback(() => {
     prevPointRef.current.initialized = false;
  }, []);

  return { drawStroke, clearCanvas, resetStroke, isDrawing, brushSettings, setBrushSettings };
}

// Utility to convert hex to rgb for opacity support
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255, 255, 255';
}
