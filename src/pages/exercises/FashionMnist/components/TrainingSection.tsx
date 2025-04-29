import React from 'react';
import { Line } from 'react-chartjs-2';
import { TextField, Select, MenuItem, FormControl, InputLabel, Paper, Typography, Box, Stack, Grid } from '@mui/material';
import { Button } from '../../../../components/Button/Button';
import { TrainingParams } from '../../../../types/TrainingParams';
import { LossFunction } from '../../../../types/LossFunction';
import { Optimizer } from '../../../../types/Optimizer';
import { TrainingHistoryPoint } from '../../../../types/TrainingHistoryPoint';
import styles from './TrainingSection.module.scss';

interface TrainingSectionProps {
  isTraining: boolean;
  trainingHistory: Array<TrainingHistoryPoint>;
  trainingParams: TrainingParams;
  layers: Array<{ units: number }>;
  onTrainingParamsChange: (params: Partial<TrainingParams>) => void;
  onAddLayer: () => void;
  onRemoveLayer: () => void;
  onLayerUnitsChange: (index: number, units: number) => void;
  onStartTraining: () => void;
  onStopTraining: () => void;
  onShowDetails: () => void;
}

export const TrainingSection: React.FC<TrainingSectionProps> = ({
  isTraining,
  trainingHistory,
  trainingParams,
  layers,
  onTrainingParamsChange,
  onAddLayer,
  onRemoveLayer,
  onLayerUnitsChange,
  onStartTraining,
  onStopTraining,
  onShowDetails,
}) => {
  const chartData = {
    labels: trainingHistory.map((_, i) => i + 1),
    datasets: [
      {
        label: 'Training Accuracy',
        data: trainingHistory.map(point => point.accuracy),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'Validation Accuracy',
        data: trainingHistory.map(point => point.validationAccuracy),
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'Training Loss',
        data: trainingHistory.map(point => point.loss),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        yAxisID: 'y1'
      },
      {
        label: 'Validation Loss',
        data: trainingHistory.map(point => point.validationLoss),
        fill: false,
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1,
        yAxisID: 'y1'
      },
    ],
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Training Section
      </Typography>
      
      <Box className={styles['training-section__architecture']}>
        <Typography variant="h6" gutterBottom>
          Model Architecture
        </Typography>
        <Stack spacing={2}>
          {layers.map((layer, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Hidden Layer ${index + 1} Units`}
              type="number"
              value={layer.units}
              onChange={e => onLayerUnitsChange(index, parseInt(e.target.value, 10))}
              inputProps={{ min: 1 }}
            />
          ))}
          <Box className={styles['training-section__layer-buttons']}>
            <Button onClick={onAddLayer}>Add Layer</Button>
            <Button onClick={onRemoveLayer} disabled={layers.length <= 1}>Remove Layer</Button>
          </Box>
        </Stack>
      </Box>

      <Box className={styles['training-section__parameters']}>
        <Typography variant="h6" gutterBottom>
          Training Parameters
        </Typography>
        <Box className={styles['training-section__params-grid']}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Learning Rate"
              type="number"
              value={trainingParams.learningRate}
              onChange={e => onTrainingParamsChange({ learningRate: parseFloat(e.target.value) })}
              inputProps={{ step: 0.001, min: 0 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Optimizer</InputLabel>
              <Select
                value={trainingParams.optimizer}
                label="Optimizer"
                onChange={e => onTrainingParamsChange({ optimizer: e.target.value as Optimizer })}
              >
                {Object.values(Optimizer).map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Loss Function</InputLabel>
              <Select
                value={trainingParams.loss}
                label="Loss Function"
                onChange={e => onTrainingParamsChange({ loss: e.target.value as LossFunction })}
              >
                {Object.values(LossFunction).map(loss => (
                  <MenuItem key={loss} value={loss}>{loss}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Epochs"
              type="number"
              value={trainingParams.epochs}
              onChange={e => onTrainingParamsChange({ epochs: parseInt(e.target.value, 10) })}
              slotProps={{ htmlInput: { min: 1 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Batch Size"
              type="number"
              value={trainingParams.batchSize}
              onChange={e => onTrainingParamsChange({ batchSize: parseInt(e.target.value, 10) })}
              slotProps={{ htmlInput: { min: 1 } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Validation Split"
              type="number"
              value={trainingParams.validationSplit}
              onChange={e => onTrainingParamsChange({ validationSplit: parseFloat(e.target.value) })}
              slotProps={{ htmlInput: { step: 0.1, min: 0, max: 1 } }}
            />
          </Grid>
        </Box>
      </Box>

      <Box className={styles['training-section__button-group']}>
        <Button onClick={onStartTraining} disabled={isTraining}>
          Start Training
        </Button>
        <Button onClick={onStopTraining} disabled={!isTraining}>
          Stop Training
        </Button>
        <Button onClick={onShowDetails}>Show Model Details</Button>
      </Box>

      {trainingHistory.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Training Progress
          </Typography>
          <Box className={styles['training-section__chart-container']}>
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: 'Accuracy'
                    },
                    min: 0,
                    max: 1
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Loss'
                    },
                    grid: {
                      drawOnChartArea: false
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Epoch'
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    enabled: true
                  }
                }
              }} 
            />
          </Box>
        </Box>
      )}
    </Paper>
  );
};