import { FC } from 'react';
import { Container, Typography } from '@mui/material';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { InfoSection, TrainingSection, EvaluationSection } from './components';
import { useHandwrittenDigit } from './hooks/useHandwrittenDigit';

export const HandwrittenDigit: FC = () => {
  const {
    model,
    trainingHistory,
    isTraining,
    trainingParams,
    setTrainingParams,
    startTraining,
    stopTraining,
    showModelSummary,
    predictDigit,
    cleanupModel,
    hiddenLayers,
    addHiddenLayer,
    removeHiddenLayer,
    updateHiddenLayer,
  } = useHandwrittenDigit();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Handwritten Digit Recognition
      </Typography>
      
      <InfoSection />
      
      <ErrorBoundary>
        <TrainingSection
          model={model}
          trainingHistory={trainingHistory}
          isTraining={isTraining}
          trainingParams={trainingParams}
          setTrainingParams={setTrainingParams}
          startTraining={startTraining}
          stopTraining={stopTraining}
          showModelSummary={showModelSummary}
          hiddenLayers={hiddenLayers}
          addHiddenLayer={addHiddenLayer}
          removeHiddenLayer={removeHiddenLayer}
          updateHiddenLayer={updateHiddenLayer}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <EvaluationSection
          model={model}
          predictDigit={predictDigit}
          cleanupModel={cleanupModel}
        />
      </ErrorBoundary>
    </Container>
  );
};