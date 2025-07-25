import { useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import type { TrainingHistoryPoint } from '../../../../types/TrainingHistoryPoint';
import { Optimizer } from '../../../../types/Optimizer';
import { LossFunction } from '../../../../types/LossFunction';
import { TrainingParams } from '../../../../types/TrainingParams';

interface HiddenLayer {
  units: number;
}

export interface FashionMnistTrainingParams {
  learningRate: number;
  optimizer: Optimizer;
  loss: LossFunction;
  validationSplit: number;
  batchSize: number;
  epochs: number;
}

interface ImageTransform {
  scale: number;
  rotation: number;
  x: number;
  y: number;
}

export const useFashionMnist = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistoryPoint[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [fashionLabels, setFashionLabels] = useState<string[]>([]);
  const [hiddenLayers, setHiddenLayers] = useState<HiddenLayer[]>([{ units: 128 }]);
  const [imageTransform, setImageTransform] = useState<ImageTransform>({
    scale: 1,
    rotation: 0,
    x: 0,
    y: 0
  });
  const [trainingParams, setTrainingParams] = useState<TrainingParams>({
    learningRate: 0.01,
    optimizer: Optimizer.ADAM,
    loss: LossFunction.CCE,
    validationSplit: 0.20,
    batchSize: 256,
    epochs: 15
  });

  const createModel = useCallback(() => {
    const model = tf.sequential();
    
    model.add(tf.layers.conv2d({
      inputShape: [28, 28, 1], 
      filters: 32, 
      kernelSize: 3, 
      strides: 1,
      activation: 'relu', 
      padding: 'same'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    model.add(tf.layers.conv2d({
      filters: 64, 
      kernelSize: 3, 
      strides: 1,
      activation: 'relu', 
      padding: 'same'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    model.add(tf.layers.flatten());
    
    hiddenLayers.forEach((layer) => {
      model.add(tf.layers.dense({
        units: layer.units,
        activation: 'relu'
      }));
    });
    
    // Output layer (10 units for fashion items)
    model.add(tf.layers.dense({
      units: 10,
      activation: 'softmax'
    }));

    return model;
  }, [hiddenLayers]);

  const startTraining = useCallback(async () => {
    setIsTraining(true);
    setTrainingHistory([]);
    
    if (model) {
      model.dispose();
    }
    
    const newModel = createModel();
    setModel(newModel);
    
    try {
      const { TRAINING_DATA, FASHION_LABELS } = await import('../../../../data/fashion-mnist.ts');
      setFashionLabels(FASHION_LABELS);
      const inputs = TRAINING_DATA.inputs as number[][];
      const outputs = TRAINING_DATA.outputs as number[];
      tf.util.shuffleCombo(inputs, outputs);

      const inputsTensor = tf.div(inputs, 255);
      const outputsTensor = tf.oneHot(tf.tensor1d(outputs, 'int32'), 10);
      const reshapedInputs = inputsTensor.reshape([inputs.length, 28, 28, 1]);
      
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
        loss: trainingParams.loss,
        metrics: ['accuracy']
      });

      console.log('Training started, this might take a long time...');

      await newModel.fit(reshapedInputs, outputsTensor, {
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

      tf.dispose([reshapedInputs, outputsTensor, inputsTensor]);

    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setIsTraining(false);
    }
  }, [trainingParams, model, createModel]);

  const stopTraining = useCallback(() => {
    console.log('Stopping training...');
    if (model) {
      model.stopTraining = true;
    }
  }, [model]);

  const predictImage = useCallback(async (imageData: ImageData) => {
    if (!model) {
      return null;
    }

    return tf.tidy(() => {
      const imageTensor = tf.browser.fromPixels(imageData, 1).expandDims(0) as tf.Tensor4D;
      
      let transformed = imageTensor;
      transformed = tf.image.resizeBilinear(transformed, [28, 28]);
      
      if (imageTransform.rotation !== 0) {
        transformed = tf.image.rotateWithOffset(
          transformed,
          (imageTransform.rotation * Math.PI) / 180,
          0
        );
      }

      const normalized = transformed.div(255);
      const flattened = normalized.reshape([1, 28, 28, 1]);
      
      const prediction = model.predict(flattened) as tf.Tensor;
      const probabilities = prediction.dataSync();
      
      return Array.from(probabilities)
        .map((prob, index) => ({ 
          label: fashionLabels[index],
          probability: prob 
        }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 2);
    });
  }, [model, imageTransform, fashionLabels]);

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

  const updateImageTransform = useCallback((transform: Partial<ImageTransform>) => {
    setImageTransform(prev => ({
      ...prev,
      ...transform
    }));
  }, []);

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
    imageTransform,
    setTrainingParams,
    startTraining,
    stopTraining,
    showModelSummary,
    predictImage,
    cleanupModel,
    hiddenLayers,
    addHiddenLayer,
    removeHiddenLayer,
    updateHiddenLayer,
    updateImageTransform,
  };
};