import { Button as MuiButton, ButtonProps } from '@mui/material';
import styles from './Button.module.scss';

interface CustomButtonProps extends Omit<ButtonProps, 'variant'> {
  customVariant?: 'primary' | 'secondary';
  variant?: ButtonProps['variant'];
}

export const Button = ({ 
  customVariant = 'primary', 
  className, 
  variant = 'contained',
  ...props 
}: CustomButtonProps) => {
  return (
    <MuiButton
      variant={variant}
      className={`${styles.button} ${customVariant && styles[customVariant]} ${className || ''}`}
      {...props}
    />
  );
};