import { Container, Card, CardContent, CardActionArea, Typography, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import { Exercise } from '../types/Exercise';
import './HomePage.scss';

const exercises: Omit<Exercise, 'id' | 'difficulty'>[] = [
  {
    title: "Smart Cam",
    description: "Use COCO-SSD model to recognize objects from your camera in real-time",
    icon: <CameraAltIcon fontSize="large" />,
    path: "/smart-cam"
  },
  {
    title: "House Pricing",
    description: "Train a simple neural network for real estate price prediction",
    icon: <HomeIcon fontSize="large" />,
    path: "/house-pricing"
  },
  {
    title: "Handwritten Digit Recognition",
    description: "Train a neural network to recognize handwritten digits using MNIST dataset",
    icon: <CreateIcon fontSize="large" />,
    path: "/digit-recognition"
  },
  {
    title: "Fashion Image Recognition",
    description: "Use transfer learning with CNN for fashion image classification",
    icon: <CheckroomIcon fontSize="large" />,
    path: "/fashion-recognition"
  }
];

export const HomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <div className="home-page__grid">
        {exercises.map((exercise) => (
          <Paper 
            key={exercise.path}
            elevation={0}
            sx={{ bgcolor: 'transparent' }}
          >
            <Link 
              to={exercise.path} 
              style={{ textDecoration: 'none' }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <CardActionArea sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {exercise.icon}
                      <Typography variant="h5" component="h2" ml={2}>
                        {exercise.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {exercise.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Paper>
        ))}
      </div>
    </Container>
  );
};