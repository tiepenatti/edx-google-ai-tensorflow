import { FC } from 'react';
import { LayersModel } from '@tensorflow/tfjs';
import { Paper, Typography, Box, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { TrainingHistoryPoint } from '../../../../types/TrainingHistoryPoint';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './TrainingSection.module.scss';
import { Optimizer } from '../../../../types/Optimizer';
import { LossFunction } from '../../../../types/LossFunction';
import { TrainingParams } from '../../../../types/TrainingParams';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrainingSectionProps {
  model: LayersModel | null;
  trainingHistory: TrainingHistoryPoint[];
  isTraining: boolean;
  trainingParams: TrainingParams;
  setTrainingParams: (params: TrainingParams) => void;
  startTraining: () => void;
  stopTraining: () => void;
  showModelSummary: () => void;
  hiddenLayers: { units: number }[];
  addHiddenLayer: () => void;
  removeHiddenLayer: () => void;
  updateHiddenLayer: (index: number, units: number) => void;
}

export const TrainingSection: FC<TrainingSectionProps> = ({
  model,
  trainingHistory,
  isTraining,
  trainingParams,
  setTrainingParams,
  startTraining,
  stopTraining,
  showModelSummary,
  hiddenLayers,
  addHiddenLayer,
  removeHiddenLayer,
  updateHiddenLayer,
}) => {
  const chartData = {
    labels: trainingHistory.map(point => point.epoch + 1),
    datasets: [
      {
        label: 'Training Accuracy',
        data: trainingHistory.map(point => point.accuracy),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Validation Accuracy',
        data: trainingHistory.map(point => point.validationAccuracy),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        title: {
          display: true,
          text: 'Accuracy'
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
      title: {
        display: false  // Removed title since we have it in Typography
      },
      legend: {
        position: 'top' as const  // Moved to top to save vertical space
      }
    },
  };

  return (
    <Paper className={styles['training-section']}>
      <Typography variant="h5" gutterBottom>
        Model Architecture
      </Typography>
      
      <Box className={styles['training-section__hidden-layers']}>
        <Typography variant="h6" gutterBottom>
          Hidden Layers
        </Typography>
        <Box className={styles['training-section__layer-inputs']}>
          {hiddenLayers.map((layer, index) => (
            <Box key={index}>
              <TextField
                fullWidth
                label={`Layer ${index + 1} Units`}
                type="number"
                value={layer.units}
                onChange={(e) => updateHiddenLayer(index, parseInt(e.target.value))}
                slotProps={{
                  input: {
                    inputProps: { min: 1 }
                  }
                }}
              />
            </Box>
          ))}
        </Box>
        <Box className={styles['training-section__layer-controls']}>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={addHiddenLayer}
          >
            Add Layer
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<RemoveIcon />}
            onClick={removeHiddenLayer}
            disabled={hiddenLayers.length <= 1}
          >
            Remove Layer
          </Button>
        </Box>
      </Box>

      <Typography variant="h5" gutterBottom>
        Training Parameters
      </Typography>
      
      <Box className={styles['training-section__params-grid']}>
        <TextField
          fullWidth
          label="Learning Rate"
          type="number"
          value={trainingParams.learningRate}
          onChange={(e) => setTrainingParams({
            ...trainingParams,
            learningRate: parseFloat(e.target.value)
          })}
          slotProps={{
            input: {
              inputProps: { step: 0.001, min: 0.001, max: 1 }
            }
          }}
        />
        <TextField
          fullWidth
          label="Epochs"
          type="number"
          value={trainingParams.epochs}
          onChange={(e) => setTrainingParams({
            ...trainingParams,
            epochs: parseInt(e.target.value)
          })}
          slotProps={{
            input: {
              inputProps: { min: 1 }
            }
          }}
        />
        <TextField
          fullWidth
          label="Batch Size"
          type="number"
          value={trainingParams.batchSize}
          onChange={(e) => setTrainingParams({
            ...trainingParams,
            batchSize: parseInt(e.target.value)
          })}
          slotProps={{
            input: {
              inputProps: { min: 1 }
            }
          }}
        />
        <TextField
          fullWidth
          label="Validation Split"
          type="number"
          value={trainingParams.validationSplit}
          onChange={(e) => setTrainingParams({
            ...trainingParams,
            validationSplit: parseFloat(e.target.value)
          })}
          slotProps={{
            input: {
              inputProps: { step: 0.1, min: 0, max: 0.5 }
            }
          }}
        />
        
        <FormControl fullWidth>
          <InputLabel>Optimizer</InputLabel>
          <Select
            label="Optimizer"
            value={trainingParams.optimizer}
            onChange={(e) => setTrainingParams({
              ...trainingParams,
              optimizer: e.target.value as Optimizer
            })}
          >
            <MenuItem value="adam">Adam</MenuItem>
            <MenuItem value="sgd">SGD</MenuItem>
            <MenuItem value="rmsprop">RMSprop</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel>Loss Function</InputLabel>
          <Select
            label="Loss Function"
            value={trainingParams.loss}
            onChange={(e) => setTrainingParams({
              ...trainingParams,
              loss: e.target.value as LossFunction
            })}
          >
            <MenuItem value="categoricalCrossentropy">Categorical Crossentropy</MenuItem>
            <MenuItem value="meanSquaredError">Mean Squared Error</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box className={styles['training-section__button-group']}>
        <Button
          variant="contained"
          color="primary"
          onClick={startTraining}
          disabled={isTraining}
        >
          Start Training
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={stopTraining}
          disabled={!isTraining}
        >
          Stop Training
        </Button>
        <Button
          variant="outlined"
          onClick={showModelSummary}
          disabled={!model}
        >
          Show Model Summary
        </Button>
      </Box>

      {trainingHistory.length > 0 && (
        <Box className={styles['training-section__chart-container']}>
          <Typography variant="h6" gutterBottom>
            Training Progress
          </Typography>
          <Line data={chartData} options={chartOptions} />
        </Box>
      )}
    </Paper>
  );
};