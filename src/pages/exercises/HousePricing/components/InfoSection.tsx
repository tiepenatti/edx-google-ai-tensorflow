import { Paper, Typography, Box, Link } from '@mui/material';

export const InfoSection = () => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom>
        House Price Prediction
      </Typography>
      <Typography variant="body1" paragraph>
        This exercise demonstrates a simple neural network that predicts house prices based on floor size and number of bedrooms
        provided by <Link href="https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/real-estate-data.js">Google</Link> for the course.
        The model uses a single dense layer with one unit to perform linear regression.
      </Typography>
      <Box component="ul">
        <Typography component="li">
          Training data is provided by Google and includes synthetic real estate data with floor size, bedrooms, and prices.
        </Typography>
        <Typography component="li">
          The data is normalized before training to improve model performance.
        </Typography>
        <Typography component="li">
          You can adjust training parameters like learning rate, optimizer, and number of epochs.
        </Typography>
        <Typography component="li">
          After training, you can input floor size and bedrooms to get a price prediction.
        </Typography>
      </Box>
    </Paper>
  );
};