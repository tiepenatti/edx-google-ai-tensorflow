import { useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import type { TrainingHistoryPoint } from '../../../../types/TrainingHistoryPoint';
import { TRAINING_DATA } from '../../../../data/mnist-data.ts';
import { Optimizer } from '../../../../types/Optimizer';
import { LossFunction } from '../../../../types/LossFunction';

interface HiddenLayer {
  units: number;
}

export interface MnistTrainingParams {
  learningRate: number;
  optimizer: Optimizer;
  lossFunction: LossFunction;
  validationSplit: number;
  batchSize: number;
  epochs: number;
}

export const useHandwrittenDigit = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistoryPoint[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [hiddenLayers, setHiddenLayers] = useState<HiddenLayer[]>([{ units: 32 }]);
  const [trainingParams, setTrainingParams] = useState<MnistTrainingParams>({
    learningRate: 0.01,
    optimizer: Optimizer.ADAM,
    lossFunction: LossFunction.CCE,
    validationSplit: 0.2,
    batchSize: 64,
    epochs: 10
  });

  const createModel = useCallback(() => {
    const model = tf.sequential();
    
    // Input layer expects flattened data (784 units)
    model.add(tf.layers.dense({inputShape: [784], units: hiddenLayers[0].units, activation: 'relu'}));
    
    // Add hidden layers dynamically based on configuration
    hiddenLayers.slice(1).forEach((layer) => {
      model.add(tf.layers.dense({
        units: layer.units,
        activation: 'relu'
      }));
    });
    
    // Output layer (10 units for digits 0-9)
    model.add(tf.layers.dense({
      units: 10,
      activation: 'softmax'
    }));

    return model;
  }, [hiddenLayers]);

  const startTraining = useCallback(async () => {
    setIsTraining(true);
    setTrainingHistory([]);
    
    // Clean up existing model before creating a new one
    if (model) {
      model.dispose();
    }
    
    const newModel = createModel();
    
    try {
      const INPUTS = TRAINING_DATA.inputs as number[][];
      const OUTPUTS = TRAINING_DATA.outputs as number[];
      tf.util.shuffleCombo(INPUTS, OUTPUTS);

      const INPUTS_TENSOR = tf.tensor2d(INPUTS);
      const OUTPUTS_TENSOR = tf.oneHot(tf.tensor1d(OUTPUTS, 'int32'), 10);
      
      let optimizer: tf.Optimizer;
      switch (trainingParams.optimizer) {
        case Optimizer.ADAM:
        default:
          optimizer = tf.train.adam(trainingParams.learningRate);
          break;
        case Optimizer.SGD:
          optimizer = tf.train.sgd(trainingParams.learningRate);
          break;
        case Optimizer.RMS:
          optimizer = tf.train.rmsprop(trainingParams.learningRate);
          break;
      }

      newModel.compile({
        optimizer,
        loss: trainingParams.lossFunction,
        metrics: ['accuracy']
      });

      await newModel.fit(INPUTS_TENSOR, OUTPUTS_TENSOR, {
        shuffle: true,
        batchSize: trainingParams.batchSize,
        validationSplit: trainingParams.validationSplit,
        epochs: trainingParams.epochs,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            if (logs) {
              const accuracy = logs.acc ?? 0;
              const loss = logs.loss ?? 0;
              const valAccuracy = logs.val_acc ?? 0;
              const valLoss = logs.val_loss ?? 0;
              
              setTrainingHistory(prev => [...prev, {
                epoch,
                accuracy: accuracy,
                loss: loss,
                validationAccuracy: valAccuracy,
                validationLoss: valLoss
              }]);
            }
            await tf.nextFrame();
          }
        }
      });

      setModel(newModel);
      INPUTS_TENSOR.dispose();
      OUTPUTS_TENSOR.dispose();

    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setIsTraining(false);
    }
  }, [trainingParams, model, createModel]);

  const stopTraining = useCallback(() => {
    if (model) {
      model.stopTraining = true;
    }
  }, [model]);

  const predictDigit = useCallback(async (tensor: tf.Tensor) => {
    if (!model) return null;

    const prediction = await model.predict(tensor) as tf.Tensor;
    const probabilities = await prediction.data();
    
    // Get top 2 predictions
    const sortedProbs = Array.from(probabilities)
      .map((prob, index) => ({ prob, index }))
      .sort((a, b) => b.prob - a.prob)
      .slice(0, 2);

    prediction.dispose();

    return sortedProbs;
  }, [model]);

  const showModelSummary = useCallback(() => {
    if (model) {
      tfvis.show.modelSummary({ name: 'Model Summary' }, model);
    }
  }, [model]);

  const cleanupModel = useCallback(() => {
    if (model) {
      model.dispose();
      setModel(null);
    }
    setTrainingHistory([]);
  }, [model]);

  const addHiddenLayer = useCallback(() => {
    setHiddenLayers(prev => [...prev, { units: 64 }]);
  }, []);

  const removeHiddenLayer = useCallback(() => {
    setHiddenLayers(prev => prev.slice(0, -1));
  }, []);

  const updateHiddenLayer = useCallback((index: number, units: number) => {
    setHiddenLayers(prev => prev.map((layer, i) => 
      i === index ? { units } : layer
    ));
  }, []);

  return {
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
  };
};