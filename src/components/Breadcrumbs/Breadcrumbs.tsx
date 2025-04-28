import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Container } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const navigationItems = [
  { path: '/', label: 'Home' },
  { path: '/smart-cam', label: 'Smart Cam' },
  { path: '/house-pricing', label: 'House Pricing' },
];

export const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);
  if (paths.length === 0) return null;

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 1,
        mt: 2,
        mb: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <MuiBreadcrumbs aria-label="breadcrumb">
        <Link
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        {paths.map((path, index) => {
          const routeTo = `/${paths.slice(0, index + 1).join('/')}`;
          const label = navigationItems.find(item => item.path === routeTo)?.label || 
            path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          
          return index === paths.length - 1 ? (
            <Typography key={path} color="text.secondary">
              {label}
            </Typography>
          ) : (
            <Link
              key={path}
              component={RouterLink}
              to={routeTo}
              color="inherit"
            >
              {label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Container>
  );
};