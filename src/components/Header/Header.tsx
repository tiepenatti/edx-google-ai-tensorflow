import { Box, Typography } from '@mui/material';
import './Header.scss';

export const Header = () => {
  return (
    <Box textAlign="center" mb={6} className="header">
      <Typography variant="h2" component="h1" gutterBottom>
        TensorFlow.js Exercises
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Interactive ML/AI demos using TensorFlow.js
      </Typography>
    </Box>
  );
};