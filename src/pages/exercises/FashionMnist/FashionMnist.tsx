import { FC } from 'react';
import { Container, Typography } from '@mui/material';
import { InfoSection, TrainingSection, EvaluationSection } from './components';
import { useFashionMnist } from './hooks/useFashionMnist';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import type { TrainingParams } from '../../../types/TrainingParams';

export const FashionMnist: FC = () => {
  const {
    model,
    isTraining,
    trainingHistory,
    trainingParams,
    hiddenLayers,
    predictImage,
    setTrainingParams,
    startTraining,
    stopTraining,
    showModelSummary,
    cleanupModel,
    addHiddenLayer,
    removeHiddenLayer,
    updateHiddenLayer,
  } = useFashionMnist();

  const handleTrainingParamsChange = (params: Partial<TrainingParams>) => {
    setTrainingParams(prev => ({ ...prev, ...params }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Fashion Recognition
      </Typography>

      <ErrorBoundary>
        <InfoSection />
      </ErrorBoundary>

      <ErrorBoundary>
        <TrainingSection
          model={model}
          isTraining={isTraining}
          trainingHistory={trainingHistory}
          trainingParams={trainingParams}
          hiddenLayers={hiddenLayers}
          setTrainingParams={handleTrainingParamsChange}
          addHiddenLayer={addHiddenLayer}
          removeHiddenLayer={removeHiddenLayer}
          updateHiddenLayer={updateHiddenLayer}
          startTraining={startTraining}
          stopTraining={stopTraining}
          showModelSummary={showModelSummary}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <EvaluationSection
          model={model}
          predictImage={predictImage}
          cleanupModel={cleanupModel}
        />
      </ErrorBoundary>
    </Container>
  );
};