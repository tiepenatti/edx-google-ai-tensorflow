import { useState } from 'react';
import { Paper, Typography, Button, TextField, Box } from '@mui/material';

interface EvaluationSectionProps {
  modelStatus: 'ready' | 'loading' | 'error';
  onPredict: (size: number, bedrooms: number) => Promise<number | null>;
  onCleanup: () => void;
}

export const EvaluationSection = ({
  modelStatus,
  onPredict,
  onCleanup,
}: EvaluationSectionProps) => {
  const [size, setSize] = useState<number>(750);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [prediction, setPrediction] = useState<number | null>(null);

  const handlePredict = async () => {
    const result = await onPredict(size, bedrooms);
    setPrediction(result);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Predict House Price
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Floor Size (sq ft)"
          type="number"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          slotProps={{
            htmlInput: { step: 50, min: 500, max: 5000 }
          }}
        />
        <TextField
          fullWidth
          label="Number of Bedrooms"
          type="number"
          value={bedrooms}
          onChange={(e) => setBedrooms(parseInt(e.target.value))}
          slotProps={{
            htmlInput: { min: 1, max: 8 }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handlePredict}
          disabled={modelStatus !== 'ready'}
        >
          Predict Price
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCleanup}
        >
          Clean Up Model
        </Button>
      </Box>

      {prediction !== null && (
        <Typography variant="h6" sx={{ mt: 3 }}>
          Estimated Price: {formatPrice(prediction)}
        </Typography>
      )}
    </Paper>
  );
};