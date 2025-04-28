import { Paper, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { Line, Scatter } from 'react-chartjs-2';
import { Optimizer } from '../../../../types/Optimizer';
import { TRAINING_DATA } from '../../../../data/real-estate-data';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
} from 'chart.js';
import { TrainingHistoryPoint } from '../../../../types/TrainingHistoryPoint';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
);

interface Prediction {
  size: number;
  bedrooms: number;
  price: number;
}

interface TrainingSectionProps {
  isTraining: boolean;
  trainingHistory: TrainingHistoryPoint[];
  onStartTraining: () => void;
  onStopTraining: () => void;
  onShowDetails: () => void;
  onUpdateParams: (params: any) => void;
  predictions: Prediction[];
}

export const TrainingSection = ({
  isTraining,
  trainingHistory,
  onStartTraining,
  onStopTraining,
  onShowDetails,
  onUpdateParams,
  predictions,
}: TrainingSectionProps) => {
  const chartData = {
    labels: trainingHistory.map(point => point.epoch),
    datasets: [
      {
        label: 'Training Loss',
        data: trainingHistory.map(point => point.loss),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Validation Loss',
        data: trainingHistory.map(point => point.validationLoss),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      }
    ],
  };

  const scatterColors = ['#003f5c', '#7a5195', '#bc5090', '#ffa600']
  const scatterData = {
    datasets: [
      {
        label: 'Predictions',
        data: predictions.map(pred => ({
          x: pred.size,
          y: pred.price,
        })),
        backgroundColor: '#ff0000',
        pointRadius: 6,
        order: 1,
        pointHoverRadius: 8,
        pointStyle: 'circle'
      },
      ...Array.from(new Set(TRAINING_DATA.inputs.map(input => input[1])))
        .sort((a, b) => a - b)
        .map((bedrooms, idx) => ({
          label: `${bedrooms} Bedrooms`,
          data: TRAINING_DATA.inputs.map((input, index) => ({
            x: input[0], // house size
            y: TRAINING_DATA.outputs[index], // price
          })).filter(point => 
            TRAINING_DATA.inputs[TRAINING_DATA.inputs.findIndex(input => 
              input[0] === point.x)][1] === bedrooms
          ),
          backgroundColor: scatterColors[idx % scatterColors.length],
          pointRadius: 4,
          order: idx + 2
        }))
    ].reverse()
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Training Parameters
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Learning Rate"
          type="number"
          defaultValue={0.01}
          slotProps={{
            input: {
              inputProps: { step: 0.001, min: 0.001, max: 1 }
            }
          }}
          onChange={(e) => onUpdateParams({ learningRate: parseFloat(e.target.value) })}
        />
        
        <FormControl fullWidth>
          <InputLabel>Optimizer</InputLabel>
          <Select
            label="Optimizer"
            defaultValue={Optimizer.SGD}
            onChange={(e) => onUpdateParams({ optimizer: e.target.value })}
          >
            <MenuItem value={Optimizer.ADAM}>Adam</MenuItem>
            <MenuItem value={Optimizer.SGD}>SGD</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Epochs"
          type="number"
          defaultValue={10}
          slotProps={{
            input: {
              inputProps: { min: 1, max: 1000 }
            }
          }}
          onChange={(e) => onUpdateParams({ epochs: parseInt(e.target.value) })}
        />

        <TextField
          fullWidth
          label="Batch Size"
          type="number"
          defaultValue={64}
          slotProps={{
            input: {
              inputProps: { min: 1, max: 256 }
            }
          }}
          onChange={(e) => onUpdateParams({ batchSize: parseInt(e.target.value) })}
        />

        <TextField
          fullWidth
          label="Validation Split"
          type="number"
          defaultValue={0.15}
          slotProps={{
            input: {
              inputProps: { step: 0.1, min: 0, max: 0.5 }
            }
          }}
          onChange={(e) => onUpdateParams({ validationSplit: parseFloat(e.target.value) })}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onStartTraining}
          disabled={isTraining}
        >
          Start Training
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onStopTraining}
          disabled={!isTraining}
        >
          Stop Training
        </Button>
        <Button
          variant="outlined"
          onClick={onShowDetails}
        >
          Show Model Details
        </Button>
      </Box>

      {trainingHistory.length > 0 && (
        <div>
          <Typography variant="h6" gutterBottom>
            Training Progress
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <div style={{ height: '300px' }}>
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'RMSE'
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
                      display: true,
                      text: 'Training Progress'
                    }
                  }
                }}
              />
            </div>
            <div style={{ height: '300px' }}>
              <Scatter
                data={scatterData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Price ($)'
                      }
                    },
                    x: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'House Size (sq ft)'
                      }
                    }
                  },
                  plugins: {
                    title: {
                      display: true,
                      text: 'House Prices by Size and Bedrooms'
                    }
                  },
                  animation: {
                    duration: 0
                  },
                  elements: {
                    point: {
                      borderWidth: 0
                    }
                  }
                }}
              />
            </div>
          </Box>
        </div>
      )}
    </Paper>
  );
};