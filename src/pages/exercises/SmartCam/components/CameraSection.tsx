import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { CameraControls } from '../components';
import { CameraCanvas } from '../components';
import { useObjectDetection } from '../hooks/useObjectDetection';
import styles from './CameraSection.module.scss';

export const CameraSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isClassifying, setIsClassifying] = useState(true);
  
  const { stopDetection, isModelLoaded } = useObjectDetection({
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
    enabled: isClassifying && isStarted
  });

  const handleStart = async () => {
    if (!isMountedRef.current) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (!isMountedRef.current) {
        // Component unmounted during getUserMedia call
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        if (isMountedRef.current) {
          setIsStarted(true);
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsStarted(false);
    }
  };

  const handleStop = () => {
    try {
      // Stop all tracks in the stream
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => {
          try {
            track.stop();
          } catch (e) {
            console.error('Error stopping track:', e);
          }
        });
        streamRef.current = null;
      }

      // Clean up video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.load();
      }

      // Stop detection and reset state
      stopDetection();
      if (isMountedRef.current) {
        setIsStarted(false);
      }
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
  };

  const handleClassificationToggle = (enabled: boolean) => {
    if (!isMountedRef.current) return;
    
    setIsClassifying(enabled);
    if (!enabled) {
      stopDetection();
      // Clear canvas when stopping classification
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      handleStop();
    };
  }, []);

  return (
    <Box>
      <Box className={styles.header}>
        <CameraAltIcon color="primary" />
        <Typography variant="h5" component="h2">
          Camera Feed
        </Typography>
      </Box>

      <Stack spacing={2}>
        <CameraCanvas
          videoRef={videoRef}
          canvasRef={canvasRef}
          isStarted={isStarted}
        />
        
        <CameraControls
          isStarted={isStarted}
          isClassifying={isClassifying}
          isModelLoaded={isModelLoaded}
          onStart={handleStart}
          onStop={handleStop}
          onClassificationToggle={handleClassificationToggle}
        />
      </Stack>
    </Box>
  );
};