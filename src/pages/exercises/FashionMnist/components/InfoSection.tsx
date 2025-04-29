import React from 'react';
import { Box, Paper, Typography, Link } from '@mui/material';
import styles from './InfoSection.module.scss';

export const InfoSection: React.FC = () => {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Fashion MNIST Classification
      </Typography>
      <Box className={styles['info-section__text']}>
        <Typography>
          This is a simple neural network that learns to classify fashion items from the Fashion MNIST dataset, 
          using a subset provided by 
          the <Link href="https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/mnist-fashion.js">
          Google course</Link> and 2D Convolutional layers.
          The dataset consists of 28x28 grayscale images of clothes and accessories.
        </Typography>
        <Typography>
          You can customize the model head architecture (which will be added after the convolutional layers) by 
          adding or removing hidden layers and adjusting their units.
          The model will learn to classify images into 10 categories: T-shirt/top, Trouser, Pullover, Dress, 
          Coat, Sandal, Shirt, Sneaker, Bag, and Ankle boot.
        </Typography>
        <Typography>
          After training, you can evaluate the model by selecting random test images and seeing how well it
          classifies them. You can also google for fashion items pictures on web and drop the image url in 
          the droppzone on the left side, ajust the image position, scale and rotation and see how well the model
          classifies them. The model will struggle with items that are significantly different from the training data.
          Images will have color inverted so black items with white background will be better recognized as 
          they are more similar to training images.
        </Typography>
      </Box>
    </Paper>
  );
};