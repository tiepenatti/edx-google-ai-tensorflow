import { FC, useRef, useEffect, useState } from 'react';
import { Paper, Typography, Box, Button, Stack, Grid } from '@mui/material';
import { LayersModel } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs-core';
import { TRAINING_DATA } from '../../../../data/mnist-data';
import styles from './EvaluationSection.module.scss';

interface EvaluationSectionProps {
  model: LayersModel | null;
  predictDigit: (tensor: tf.Tensor) => Promise<Array<{ prob: number; index: number }> | null>;
  cleanupModel: () => void;
}

export const EvaluationSection: FC<EvaluationSectionProps> = ({
  model,
  predictDigit,
  cleanupModel,
}) => {
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(20);
  const [predictions, setPredictions] = useState<Array<{ prob: number; index: number }>>([]);

  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!canvas || !previewCanvas) return;

    // Set up drawing canvas
    canvas.width = 280;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set up preview canvas with black background
    previewCanvas.width = 280;
    previewCanvas.height = 280;
    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) return;
    previewCtx.fillStyle = 'black';
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    drawGrid(previewCtx);
  }, []); // Only run once on mount

  // Update line width separately
  useEffect(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = lineWidth;
  }, [lineWidth]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.3)';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= 280; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 280);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= 280; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(280, y);
      ctx.stroke();
    }
  };

  const getCanvasMousePosition = (canvas: HTMLCanvasElement, e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCanvasMousePosition(canvas, e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCanvasMousePosition(canvas, e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPredictions([]);
  };

  const updatePreview = async () => {
    const drawingCanvas = drawingCanvasRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!drawingCanvas || !previewCanvas) return;

    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) return;

    // Create tensor and invert colors (same as what we send to model)
    const tensor = tf.browser.fromPixels(drawingCanvas, 1)
      .resizeBilinear([28, 28])
      .toFloat()
      .div(255.0);
    
    // Invert the colors (1 - x for each pixel)
    const invertedTensor = tensor.sub(1).mul(-1);

    const pixelData = await invertedTensor.squeeze().data();
    
    previewCtx.fillStyle = 'black';
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    const pixelSize = previewCanvas.width / 28;
    
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const value = pixelData[y * 28 + x];
        if (value > 0) {
          previewCtx.fillStyle = `rgba(255, 255, 255, ${value})`;
          previewCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    
    drawGrid(previewCtx);
    
    tensor.dispose();
    invertedTensor.dispose();
  };

  const handlePredict = async () => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) { 
      return;
    }

    await updatePreview();

    const tensor = tf.browser.fromPixels(canvas, 1)
      .resizeBilinear([28, 28])
      .toFloat()
      .div(255.0);  // Normalize to [0, 1]
    
    // Invert the colors (1 - x for each pixel)
    const invertedTensor = tensor.sub(1).mul(-1);
    
    const modelInput = invertedTensor.reshape([1, 784]);

    const result = await predictDigit(modelInput);
    if (result) {
      setPredictions(result);
    }
    tensor.dispose();
    invertedTensor.dispose();
  };

  const pickRandomSample = async () => {
    const randomIndex = Math.floor(Math.random() * TRAINING_DATA.inputs.length);
    const sampleData = TRAINING_DATA.inputs[randomIndex];
    
    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas) return;

    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) return;

    previewCtx.fillStyle = 'black';
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    const pixelSize = previewCanvas.width / 28;
    
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const value = sampleData[y * 28 + x];
        if (value > 0) {
          previewCtx.fillStyle = `rgba(255, 255, 255, ${value})`;
          previewCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    
    drawGrid(previewCtx);
    const tensor = tf.tensor2d([sampleData]).reshape([1, 784]);
    const result = await predictDigit(tensor);
    if (result) {
      setPredictions(result);
    }
    tensor.dispose();
  };

  return (
    <Paper className={styles['evaluation-section']}>
      <Typography variant="h5" gutterBottom>
        Digit Recognition Evaluation
      </Typography>

      <Grid container spacing={4} className={styles['evaluation-section__grid']}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box className={styles['evaluation-section__canvas-container']}>
            <Typography variant="h6" gutterBottom>
              Draw a digit here
            </Typography>
            <div className={`${styles['evaluation-section__canvas-box']} ${styles['evaluation-section__canvas-box--drawing']}`}>
              <canvas
                ref={drawingCanvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                className={styles['evaluation-section__canvas']}
              />
            </div>
          </Box>

          <Stack direction="row" spacing={2} className={styles['evaluation-section__line-width-controls']}>
            <Button variant="outlined" onClick={clearCanvas}>
              Clear Canvas
            </Button>
            <Stack direction="row" spacing={1} alignItems="center">
              <Button size="small" variant="outlined" onClick={() => setLineWidth(prev => Math.max(5, prev - 5))}>
                -
              </Button>
              <Typography variant="body2">
                Line Width: {lineWidth}
              </Typography>
              <Button size="small" variant="outlined" onClick={() => setLineWidth(prev => Math.min(50, prev + 5))}>
                +
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box className={styles['evaluation-section__canvas-container']}>
            <Typography variant="h6" gutterBottom>
              28x28 Preview (Model Input)
            </Typography>
            <div className={`${styles['evaluation-section__canvas-box']} ${styles['evaluation-section__canvas-box--preview']}`}>
              <canvas
                ref={previewCanvasRef}
                className={styles['evaluation-section__canvas']}
              />
            </div>
          </Box>
          <Button
            variant="outlined"
            onClick={pickRandomSample}
            disabled={!model}
            className={styles['evaluation-section__random-sample-button']}
          >
            Pick Random Sample
          </Button>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} className={styles['evaluation-section__controls']}>
        <Button
          variant="contained"
          onClick={handlePredict}
          disabled={!model}
        >
          Predict Digit
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={cleanupModel}
          disabled={!model}
        >
          Cleanup Model
        </Button>
      </Stack>

      {predictions.length > 0 && (
        <div className={styles['evaluation-section__predictions']}>
          <Typography variant="h6" gutterBottom>
            Predictions:
          </Typography>
          {predictions.map(({ prob, index }, i) => (
            <div key={index} className={styles['evaluation-section__prediction-item']}>
              <Typography 
                variant="body1" 
                className={`${styles['evaluation-section__prediction-item-label']} ${i === 0 ? styles['evaluation-section__prediction-item-label--bold'] : ''}`}
              >
                Digit {index}:
              </Typography>
              <Typography 
                variant="body1" 
                className={styles['evaluation-section__prediction-item-percentage']}
              >
                {(prob * 100).toFixed(2)}%
              </Typography>
              {i === 0 && (
                <Typography variant="body2" color="primary">
                  (Best Match)
                </Typography>
              )}
            </div>
          ))}
        </div>
      )}
    </Paper>
  );
};