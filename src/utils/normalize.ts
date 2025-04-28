import * as tf from '@tensorflow/tfjs';

export function normalizeTensor(tensor: tf.Tensor, min: tf.Tensor | null, max: tf.Tensor | null) {
  const result = tf.tidy(function() {
    const MIN_VALUES = min || tf.min(tensor, 0);
    const MAX_VALUES = max || tf.max(tensor, 0);
    const TENSOR_SUBTRACT_MIN_VALUE = tf.sub(tensor, MIN_VALUES);
    const RANGE_SIZE = tf.sub(MAX_VALUES, MIN_VALUES);
    const NORMALIZED_VALUES = tf.div(TENSOR_SUBTRACT_MIN_VALUE, RANGE_SIZE);
    return {NORMALIZED_VALUES, MIN_VALUES, MAX_VALUES};
  });
  return result;
}
