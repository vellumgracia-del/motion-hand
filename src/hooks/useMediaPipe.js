import { useEffect, useRef, useState } from 'react';
import * as cam_utils from '@mediapipe/camera_utils';
import * as mp_hands from '@mediapipe/hands';

const Camera = cam_utils.Camera || window.Camera;
const Hands = mp_hands.Hands || window.Hands;
import { countFingers } from '../utils/fingerDetection';

export function useMediaPipe(videoElementRef) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state to expose to UI
  const [landmarks, setLandmarks] = useState(null);
  const [fingerCount, setFingerCount] = useState(0);
  
  // Instance refs to prevent re-instantiation
  const handsRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!videoElementRef.current) return;

    // Initialize Hands model
    try {
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 1, // Only tracking 1 hand to keep it simple and robust
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      hands.onResults((results) => {
        // Hide loader when first results arrive
        if (isLoading) {
          setIsLoading(false);
        }

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const currentLandmarks = results.multiHandLandmarks[0];
          setLandmarks(currentLandmarks);
          setFingerCount(countFingers(currentLandmarks));
        } else {
          setLandmarks(null);
          setFingerCount(0);
        }
      });
      handsRef.current = hands;

      // Initialize Camera
      const camera = new Camera(videoElementRef.current, {
        onFrame: async () => {
          if (videoElementRef.current && handsRef.current) {
            await handsRef.current.send({ image: videoElementRef.current });
          }
        },
        width: 1280,
        height: 720
      });
      
      cameraRef.current = camera;
      
      camera.start().catch(err => {
        console.error("Camera error:", err);
        setError("Failed to access camera. Please allow camera permissions.");
        setIsLoading(false);
      });

    } catch (err) {
      console.error("MediaPipe Init Error:", err);
      setError("Failed to load Neural Network Modules.");
      setIsLoading(false);
    }

    // Cleanup on unmount
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [videoElementRef]);

  return { landmarks, fingerCount, isLoading, error };
}
