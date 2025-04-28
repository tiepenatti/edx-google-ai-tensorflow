import { useState, useCallback, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import { TRAINING_DATA } from '../../../../data/real-estate-data';
import { Optimizer } from '../../../../types/Optimizer';
import { normalizeTensor } from '../../../../utils/normalize';
import { TrainingParams } from '../../../../types/TrainingParams';
import { NormalizationParams } from '../../../../types/NormalizationParams';
import { LossFunction } from '../../../../types/LossFunction';
import { TrainingHistoryPoint } from '../../../../types/TrainingHistoryPoint';

export const useHousePricing = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [modelStatus, setModelStatus] = useState<'ready' | 'loading' | 'error'>('loading');
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistoryPoint[]>([]);
  const normalizationRef = useRef<NormalizationParams | null>(null);
  
  const trainingParamsRef = useRef<TrainingParams>({
    learningRate: 0.01,
    optimizer: Optimizer.SGD,
    loss: LossFunction.MSE,
    validationSplit: 0.15,
    batchSize: 64,
    epochs: 10
  });

  useEffect(() => {
    setModelStatus('loading');
  }, []);

  const createModel = useCallback(() => {
    const model = tf.sequential();
    
    // Single neuron, linear layer
    model.add(tf.layers.dense({
      units: 1,
      inputShape: [2]
    }));
    
    model.summary();
    
    let optimizer;
    switch (trainingParamsRef.current.optimizer) {
      case Optimizer.ADAM:
        optimizer = tf.train.adam(trainingParamsRef.current.learningRate);
        break;
      case Optimizer.SGD:
      default:
        optimizer = tf.train.sgd(trainingParamsRef.current.learningRate);
        break;
    }

    model.compile({
      optimizer,
      loss: trainingParamsRef.current.loss,
    });

    return model;
  }, []);

  const startTraining = useCallback(async () => {
    try {
      setIsTraining(true);
      setTrainingHistory([]);
      
      // Clean up any existing model before creating a new one
      if (model) {
        model.dispose();
      }

      const newModel = createModel();
      setModel(newModel);

      disposeNormalizationRefIfExist();

      const inputs = TRAINING_DATA.inputs;
      const outputs = TRAINING_DATA.outputs;
      tf.util.shuffleCombo(inputs, outputs);
      const { NORMALIZED_VALUES: normalizedInput, MIN_VALUES: inputMin, MAX_VALUES: inputMax } = 
        normalizeTensor(tf.tensor2d(inputs), null, null);
      normalizationRef.current = { min: inputMin, max: inputMax };
      
      const outputTensor = tf.tensor1d(outputs);

      await newModel.fit(normalizedInput, outputTensor, {
        batchSize: trainingParamsRef.current.batchSize,
        epochs: trainingParamsRef.current.epochs,
        validationSplit: trainingParamsRef.current.validationSplit,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const sqrtLoss = Math.sqrt(logs?.loss || 0);
            const sqrtValLoss = Math.sqrt(logs?.val_loss || 0);
            
            setTrainingHistory(prev => [...prev, <TrainingHistoryPoint>{
              epoch,
              loss: sqrtLoss,
              validationLoss: sqrtValLoss
            }]);
          }
        }
      });

      setModelStatus('ready');
    } catch (error) {
      console.error('Training error:', error);
      setModelStatus('error');
    } finally {
      setIsTraining(false);
    }
  }, [model, createModel]);

  const disposeNormalizationRefIfExist = () => {
    if (normalizationRef.current) {
      normalizationRef.current.min.dispose();
      normalizationRef.current.max.dispose();
      normalizationRef.current = null;
    }
  };

  const predictPrice = useCallback(async (size: number, bedrooms: number) => {
    if (!model || !normalizationRef.current) return null;

    return tf.tidy(() => {
      const input = tf.tensor2d([[size, bedrooms]]);
      const { NORMALIZED_VALUES: normalizedInput } = normalizeTensor(
        input, 
        normalizationRef.current!.min, 
        normalizationRef.current!.max
      );
      
      const prediction = model!.predict(normalizedInput) as tf.Tensor;
      return prediction.dataSync()[0];
    });
  }, [model]);

  const cleanupModel = useCallback(() => {
    if (model) {
      model.dispose();
      setModel(null);
    }
    if (normalizationRef.current) {
      normalizationRef.current.min.dispose();
      normalizationRef.current.max.dispose();
      normalizationRef.current = null;
    }
    setModelStatus('loading');
    setTrainingHistory([]);
  }, [model]);

  const updateTrainingParams = useCallback((params: Partial<TrainingParams>) => {
    trainingParamsRef.current = {
      ...trainingParamsRef.current,
      ...params
    };
  }, []);

  const showModelDetails = useCallback(() => {
    if (model) {
      const visor = tfvis.visor();
      // Only create and show the MODEL tab when showing model details
      visor.surface({ name: 'Model Training', tab: 'MODEL' });
      visor.open();
      visor.setActiveTab('MODEL');
      
      tfvis.show.modelSummary(
        { name: 'House Price Prediction Model', tab: 'MODEL' },
        model
      );
      
      const layer = model.layers[0];
      if (layer) {
        tfvis.show.layer({ name: 'Layer Details', tab: 'MODEL' }, layer);
      }
    }
  }, [model]);

  const stopTraining = useCallback(() => {
    if (model) {
      model.stopTraining = true;
    }
  }, [model]);

  return {
    isTraining,
    trainingHistory,
    modelStatus,
    startTraining,
    stopTraining,
    predictPrice,
    showModelDetails,
    cleanupModel,
    updateTrainingParams,
  };
};