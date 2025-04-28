import { LossFunction } from './LossFunction';
import { Optimizer } from './Optimizer';

export interface TrainingParams {
  learningRate: number;
  optimizer: Optimizer;
  loss: LossFunction;
  validationSplit: number;
  batchSize: number;
  epochs: number;
}
