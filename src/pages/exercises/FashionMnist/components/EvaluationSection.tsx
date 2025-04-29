import React, { useRef, useState, useCallback } from 'react';
import { Paper, Typography, Box, Stack, Slider } from '@mui/material';
import { Button } from '../../../../components/Button/Button';
import { TRAINING_DATA } from '../../../../data/fashion-mnist';
import styles from './EvaluationSection.module.scss';

interface EvaluationSectionProps {
  prediction: Array<{ label: string; probability: number }> | null;
  onEvaluate: (imageData: ImageData) => void;
  onCleanup: () => void;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  prediction,
  onEvaluate,
  onCleanup,
}) => {
  const dropzoneCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const drawPreviewGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    const pixelSize = 10;
    for (let x = 0; x <= 280; x += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 280);
      ctx.stroke();
    }
    for (let y = 0; y <= 280; y += pixelSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(280, y);
      ctx.stroke();
    }
  }, []);

  const updatePreviewFromDropzone = useCallback(() => {
    const dropzoneCanvas = dropzoneCanvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!dropzoneCanvas || !previewCanvas) return;

    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) return;

    previewCtx.fillStyle = '#000';
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(dropzoneCanvas, 0, 0, 28, 28);
    const imageData = tempCtx.getImageData(0, 0, 28, 28);
    const data = imageData.data;
    
    const pixelSize = 10;
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const i = (y * 28 + x) * 4;
        const gray = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
        const inverse = 255 - gray;
        previewCtx.fillStyle = `rgb(${inverse},${inverse},${inverse})`;
        previewCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    drawPreviewGrid(previewCtx);
  }, [drawPreviewGrid]);

  const drawDropzoneCanvas = useCallback(() => {
    const canvas = dropzoneCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!imageUrl) {
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Drop an image URL here', canvas.width / 2, canvas.height / 2);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      if (!canvas || !ctx) return;
      ctx.save();
      ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      updatePreviewFromDropzone();
    };

    img.src = imageUrl;
  }, [imageUrl, scale, rotation, position, updatePreviewFromDropzone]);

  React.useEffect(() => {
    drawDropzoneCanvas();
  }, [drawDropzoneCanvas]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('text');
    if (url.match(/^https?:\/\//i)) {
      setImageUrl(url);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleEvaluate = () => {
    if (!imageUrl) return;
    
    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas) return;
    
    const imageData = previewCanvas.getContext('2d')?.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
    if (imageData) {
      onEvaluate(imageData);
    }
  };

  const handleRandomImage = () => {
    setImageUrl(null);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    
    const index = Math.floor(Math.random() * TRAINING_DATA.inputs.length);
    const imageData = TRAINING_DATA.inputs[index];
    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas) return;
    
    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    const pixelSize = 10;
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const value = imageData[y * 28 + x];
        ctx.fillStyle = `rgb(${value},${value},${value})`;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      }
    }

    drawPreviewGrid(ctx);
    const finalImageData = ctx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
    onEvaluate(finalImageData);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Evaluation Section
      </Typography>
      
      <Stack spacing={3}>
        <Box className={styles['evaluation-section__canvases']}>
          <Box className={styles['evaluation-section__canvas-container']}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Drop image URL
              </Typography>
              <canvas
                ref={dropzoneCanvasRef}
                width={560}
                height={560}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`${styles['evaluation-section__dropzone-canvas']} ${
                  isDragging 
                    ? styles['evaluation-section__dropzone-canvas--dragging']
                    : styles['evaluation-section__dropzone-canvas--idle']
                }`}
              />
            </Box>

            <Box className={styles['evaluation-section__dropzone-controls']}>
              <Box>
                <Typography variant="body2" gutterBottom>Scale</Typography>
                <Slider
                  size="small"
                  value={scale}
                  onChange={(_, value) => setScale(value as number)}
                  min={0.1}
                  max={2}
                  step={0.1}
                  valueLabelDisplay="auto"
                  disabled={!imageUrl}
                />
              </Box>
              <Box>
                <Typography variant="body2" gutterBottom>Rotation</Typography>
                <Slider
                  size="small"
                  value={rotation}
                  onChange={(_, value) => setRotation(value as number)}
                  min={-180}
                  max={180}
                  valueLabelDisplay="auto"
                  disabled={!imageUrl}
                />
              </Box>
            </Box>

            <Box className={styles['evaluation-section__button-group']}>
              <Button onClick={handleEvaluate} disabled={!imageUrl}>
                Predict Image
              </Button>
              <Button onClick={onCleanup}>
                Cleanup Model
              </Button>
            </Box>
          </Box>

          <Box className={styles['evaluation-section__preview-container']}>
            <Typography variant="h6" gutterBottom>
              28x28 Preview (Model Input)
            </Typography>
            <canvas
              ref={previewCanvasRef}
              width={280}
              height={280}
              className={styles['evaluation-section__preview-canvas']}
            />
            <Button onClick={handleRandomImage}>Random Test Image</Button>
          </Box>
        </Box>

        {prediction && prediction.length > 0 && (
          <Box className={styles['evaluation-section__predictions']}>
            <Typography variant="h6" className={styles['evaluation-section__predictions-title']}>
              Top Predictions
            </Typography>
            {prediction.map((pred, i) => (
              <Typography 
                key={i} 
                variant="body1" 
                className={styles['evaluation-section__predictions-item']}
              >
                {i + 1}. {pred.label} ({(pred.probability * 100).toFixed(2)}% confidence)
              </Typography>
            ))}
          </Box>
        )}
      </Stack>
    </Paper>
  );
};