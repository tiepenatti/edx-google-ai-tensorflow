import { Paper, Typography, Box, Link } from '@mui/material';

export const InfoSection = () => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Handwritten Digit Recognition
      </Typography>
      <Typography>
        This exercise uses a custom neural network with dense layers to recognize handwritten digits using a 
        subset of the MNIST dataset prepared for 
        the <Link href="https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/mnist.js">
        Google course</Link>. The model is trained on grayscale images of size 28x28 pixels, where the background is
        black (0) and the handwritten
        digits are white (1) or various shades of gray.
      </Typography>
      <Typography>
        You can experiment with different model architectures by adding or removing hidden layers and adjusting their units.
        The model will struggle with digits that are significantly different from the training data (tilted, scaled, or
        offset) due to only having dense layers (no convolutional layers).
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Instructions:</Typography>
        <Box component="ol" sx={{ pl: 2, mt: 1 }}>
          <Typography component="li" sx={{ mb: 0.5 }}>
            Configure the model architecture by adding/removing hidden layers in the Training section
          </Typography>
          <Typography component="li" sx={{ mb: 0.5 }}>
            Adjust the training parameters (learning rate, optimizer, etc.)
          </Typography>
          <Typography component="li" sx={{ mb: 0.5 }}>
            Start training and observe the accuracy graph
          </Typography>
          <Typography component="li" sx={{ mb: 0.5 }}>
            Once training is complete, try drawing digits in the evaluation section
          </Typography>
          <Typography component="li" sx={{ mb: 0.5 }}>
            You can also test the model with random samples from the training set
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};