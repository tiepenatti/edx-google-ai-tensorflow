import { TextField, TextFieldProps } from '@mui/material';
import styles from './Input.module.scss';

type CustomInputProps = TextFieldProps & {
  className?: string;
};

export const Input = ({ 
  variant = 'outlined', 
  className,
  ...props 
}: CustomInputProps) => {
  return (
    <TextField
      variant={variant}
      className={`${styles.input} ${className || ''}`}
      {...props}
    />
  );
};