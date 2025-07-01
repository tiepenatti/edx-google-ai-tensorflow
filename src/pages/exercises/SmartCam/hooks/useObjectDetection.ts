import { useState, useEffect, useCallback, useRef, RefObject } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

interface UseObjectDetectionProps {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  enabled: boolean;
}

export const useObjectDetection = ({
  videoRef,
  canvasRef,
  enabled,
}: UseObjectDetectionProps) => {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const DETECTION_INTERVAL = 100;

  const clearTimeoutSafely = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const initializeTensorFlow = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      await tf.ready();
      await tf.setBackend('webgl');
      // Clear any existing memory before initialization
      tf.engine().disposeVariables();
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing TensorFlow:', error);
    }
  }, []);

  const drawPredictions = useCallback(async () => {
    // Early return if not ready, enabled, or unmounted
    if (!isMountedRef.current || !model || !videoRef.current || !canvasRef.current || !enabled || !isInitialized) {
      return;
    }

    try {
      // Check if video is actually ready and has valid dimensions
      if (videoRef.current.readyState !== 4 || 
          videoRef.current.videoWidth === 0 || 
          videoRef.current.videoHeight === 0) {
        // Try again later
        timeoutIdRef.current = setTimeout(drawPredictions, DETECTION_INTERVAL);
        return;
      }

      // Update canvas dimensions if needed
      if (canvasRef.current.width !== videoRef.current.videoWidth) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }

      // Start a new tensor scope for each detection cycle
      await tf.engine().startScope();
      try {
        const predictions = await model.detect(videoRef.current);
        
        // Early return if component unmounted during detection
        if (!isMountedRef.current || !canvasRef.current) return;
        
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Clear previous drawings
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw new predictions
        predictions.forEach(prediction => {
          const [x, y, width, height] = prediction.bbox;
          
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          
          ctx.fillStyle = '#00ff00';
          ctx.font = '16px Arial';
          ctx.fillText(
            `${prediction.class} ${Math.round(prediction.score * 100)}%`,
            x,
            y > 10 ? y - 5 : 10
          );
        });

        // Schedule next detection if still enabled
        if (isMountedRef.current && enabled) {
          timeoutIdRef.current = setTimeout(drawPredictions, DETECTION_INTERVAL);
        }
      } finally {
        // Always end the scope to prevent memory leaks
        tf.engine().endScope();
      }
    } catch (error) {
      console.error('Error during detection:', error);
      // Clean up any hanging tensors in case of error
      if (tf.engine().isTapeOn()) {
        tf.engine().endScope();
      }
      
      // Try again if still mounted and enabled
      if (isMountedRef.current && enabled) {
        timeoutIdRef.current = setTimeout(drawPredictions, DETECTION_INTERVAL);
      }
    }
  }, [model, videoRef, canvasRef, enabled, isInitialized]);

  const startDetection = useCallback(() => {
    if (!isModelLoaded || !isInitialized) {
      return;
    }
    clearTimeoutSafely();
    // Clear any lingering tensors before starting new detection cycle
    tf.engine().disposeVariables();
    drawPredictions();
  }, [isModelLoaded, drawPredictions, isInitialized]);

  const stopDetection = useCallback(() => {
    clearTimeoutSafely();

    // Clear the canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    // Clean up tensors
    tf.engine().disposeVariables();
  }, [canvasRef]);

  // Initialize TensorFlow
  useEffect(() => {
    initializeTensorFlow();
  }, []);

  // Load model after initialization
  useEffect(() => {
    if (isInitialized) {
      const loadModel = async () => {
        try {
          const loadedModel = await cocoSsd.load();
          if (isMountedRef.current) {
            setModel(loadedModel);
            setIsModelLoaded(true);
          }
        } catch (error) {
          console.error('Error loading COCO-SSD model:', error);
        }
      };
      loadModel();
    }
  }, [isInitialized]);

  // Handle enabled/disabled state changes
  useEffect(() => {
    if (enabled && isModelLoaded && isInitialized) {
      startDetection();
    } else {
      stopDetection();
    }
    return clearTimeoutSafely;
  }, [enabled, isModelLoaded, isInitialized, startDetection, stopDetection]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopDetection();
      // Final cleanup of any remaining tensors
      tf.engine().disposeVariables();
    };
  }, [stopDetection]);

  return {
    isModelLoaded: isModelLoaded && isInitialized,
    startDetection,
    stopDetection,
  };
};