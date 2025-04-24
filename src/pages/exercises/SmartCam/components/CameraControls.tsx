import { Box, Switch, FormControlLabel } from '@mui/material';
import { Button } from '../../../../components/Button/Button';

interface CameraControlsProps {
  isStarted: boolean;
  isClassifying: boolean;
  isModelLoaded: boolean;
  onStart: () => void;
  onStop: () => void;
  onClassificationToggle: (value: boolean) => void;
}

export const CameraControls = ({
  isStarted,
  isClassifying,
  isModelLoaded,
  onStart,
  onStop,
  onClassificationToggle,
}: CameraControlsProps) => {
  return (
    <Box display="flex" gap={2} alignItems="center">
      <Button
        onClick={isStarted ? onStop : onStart}
        customVariant={isStarted ? 'secondary' : 'primary'}
      >
        {isStarted ? 'Stop Camera' : 'Start Camera'}
      </Button>

      {isStarted && (
        <FormControlLabel
          control={
            <Switch
              checked={isClassifying}
              onChange={(e) => onClassificationToggle(e.target.checked)}
              disabled={!isModelLoaded}
            />
          }
          label="Enable Classification"
        />
      )}
    </Box>
  );
};