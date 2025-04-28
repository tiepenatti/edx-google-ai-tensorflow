import * as tf from '@tensorflow/tfjs';

export interface NormalizationParams {
  min: tf.Tensor;
  max: tf.Tensor;
}
