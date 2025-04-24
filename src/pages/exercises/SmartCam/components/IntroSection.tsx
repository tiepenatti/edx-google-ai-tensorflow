import { Typography, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const IntroSection = () => {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <InfoIcon color="primary" />
        <Typography variant="h5" component="h2">
          Introduction
        </Typography>
      </Box>
      
      <Typography paragraph>
        This exercise demonstrates real-time object detection using the COCO-SSD 
        (Common Objects in Context - Single Shot MultiBox Detector) model in your browser.
        The model can recognize up to 80 different types of common objects in real-time.
      </Typography>
      
      <Typography paragraph>
        <strong>Privacy Note:</strong> All processing is done locally in your browser. 
        No images or data are sent to any server. The camera feed is only used for 
        real-time object detection and is not stored or transmitted.
      </Typography>
    </Box>
  );
};