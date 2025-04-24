import { RefObject, useEffect } from 'react';
import { Box } from '@mui/material';
import styles from './CameraCanvas.module.scss';

interface CameraCanvasProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isStarted: boolean;
}

export const CameraCanvas = ({
  videoRef,
  canvasRef,
  isStarted,
}: CameraCanvasProps) => {
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = () => {
        if (canvasRef.current && videoRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }
      };
    }
  }, []);

  return (
    <Box className={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`${styles.video} ${!isStarted ? styles['video--hidden'] : ''}`}
      />
      <canvas
        ref={canvasRef}
        className={styles.canvas}
      />
    </Box>
  );
};