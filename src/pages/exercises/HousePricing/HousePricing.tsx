import React, { useState } from 'react';
import { Container } from '@mui/material';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { TrainingSection } from './components/TrainingSection';
import { EvaluationSection } from './components/EvaluationSection';
import { InfoSection } from './components/InfoSection';
import { useHousePricing } from './hooks/useHousePricing';

interface Prediction {
  size: number;
  bedrooms: number;
  price: number;
}

const HousePricing: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const {
    isTraining,
    trainingHistory,
    modelStatus,
    startTraining,
    stopTraining,
    predictPrice,
    showModelDetails,
    cleanupModel,
    updateTrainingParams,
  } = useHousePricing();

  const handlePredict = async (size: number, bedrooms: number) => {
    const price = await predictPrice(size, bedrooms);
    if (price !== null) {
      setPredictions(prev => [...prev, { size, bedrooms, price }]);
    }
    return price;
  };

  const handleCleanup = () => {
    cleanupModel();
    setPredictions([]);
  };

  return (
    <ErrorBoundary>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <InfoSection />
        <TrainingSection
          isTraining={isTraining}
          trainingHistory={trainingHistory}
          onStartTraining={startTraining}
          onStopTraining={stopTraining}
          onShowDetails={showModelDetails}
          onUpdateParams={updateTrainingParams}
          predictions={predictions}
        />
        <EvaluationSection
          modelStatus={modelStatus}
          onPredict={handlePredict}
          onCleanup={handleCleanup}
        />
      </Container>
    </ErrorBoundary>
  );
};

export default HousePricing;