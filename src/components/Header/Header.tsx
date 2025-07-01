import { AppBar, Toolbar, Typography, Link, Box, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './Header.scss';

const navigationItems = [
  { path: '/', label: 'Home' },
  { path: '/smart-cam', label: 'Smart Cam' },
  { path: '/house-pricing', label: 'House Pricing' },
  { path: '/handwritten-digit', label: 'Handwritten Digit' },
  { path: '/fashion-mnist', label: 'Fashion Recognition' },
];

export const Header = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ flexDirection: 'column', alignItems: 'stretch', py: 1 }}>
          <Typography variant="h5" component="h1" sx={{ mb: 1, color: 'white' }}>
            TensorFlow.js Exercises
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {item.label}
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};