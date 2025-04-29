import React from 'react';
import { Container, Typography } from '@mui/material';
import { InfoSection, TrainingSection, EvaluationSection } from './components';
import { useFashionMnist } from './hooks/useFashionMnist';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import type { TrainingParams } from '../../../types/TrainingParams';

export const FashionMnist: React.FC = () => {
  const {
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
    updateHiddenLayer
  } = useFashionMnist();

  const [predictions, setPredictions] = React.useState<Array<{ label: string; probability: number }> | null>(null);

  const convertedParams: TrainingParams = {
    ...trainingParams,
    loss: trainingParams.lossFunction
  };

  const handleTrainingParamsChange = (params: Partial<TrainingParams>) => {
    setTrainingParams(prev => ({
      ...prev,
      ...params,
      lossFunction: params.loss || prev.lossFunction
    }));
  };

  const handleEvaluate = async (imageData: ImageData) => {
    const result = await predictImage(imageData);
    setPredictions(result);
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
          isTraining={isTraining}
          trainingHistory={trainingHistory}
          trainingParams={convertedParams}
          layers={hiddenLayers}
          onTrainingParamsChange={handleTrainingParamsChange}
          onAddLayer={addHiddenLayer}
          onRemoveLayer={removeHiddenLayer}
          onLayerUnitsChange={updateHiddenLayer}
          onStartTraining={startTraining}
          onStopTraining={stopTraining}
          onShowDetails={showModelSummary}
        />
      </ErrorBoundary>

      <ErrorBoundary>
        <EvaluationSection
          prediction={predictions}
          onEvaluate={handleEvaluate}
          onCleanup={() => {
            cleanupModel();
            setPredictions(null);
          }}
        />
      </ErrorBoundary>
    </Container>
  );
};