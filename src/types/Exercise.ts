import { ReactElement } from 'react';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  icon: ReactElement;
  path: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}