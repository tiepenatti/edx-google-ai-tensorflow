import { Container, Typography, Card, CardContent } from '@mui/material';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { IntroSection } from './components/IntroSection';
import { CameraSection } from './components/CameraSection';

export const SmartCam = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Smart Cam Exercise
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <IntroSection />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <ErrorBoundary>
            <CameraSection />
          </ErrorBoundary>
        </CardContent>
      </Card>
    </Container>
  );
};