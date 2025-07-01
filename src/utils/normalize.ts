import * as tf from '@tensorflow/tfjs';

export function normalizeTensor(tensor: tf.Tensor, min: tf.Tensor | null, max: tf.Tensor | null) {
  if (!tensor) {
    throw new Error('Input tensor is required');
  }

  // Use tf.tidy for automatic tensor cleanup
  const result = tf.tidy(() => {
    const MIN_VALUES = min || tf.min(tensor, 0);
    const MAX_VALUES = max || tf.max(tensor, 0);
    
    // Check for division by zero
    const RANGE_SIZE = tf.sub(MAX_VALUES, MIN_VALUES);
    const safeRange = tf.where(
      tf.equal(RANGE_SIZE, tf.zerosLike(RANGE_SIZE)),
      tf.onesLike(RANGE_SIZE),
      RANGE_SIZE
    );
    
    const TENSOR_SUBTRACT_MIN_VALUE = tf.sub(tensor, MIN_VALUES);
    const NORMALIZED_VALUES = tf.div(TENSOR_SUBTRACT_MIN_VALUE, safeRange);
    
    return { NORMALIZED_VALUES, MIN_VALUES, MAX_VALUES };
  });

  return result;
}
