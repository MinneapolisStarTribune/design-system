import React from 'react';
import { ThemeAwareColorCategory } from './ThemeAwareColorCategory';

const groupButtonColors = (colorKey: string): string | null => {
  if (colorKey.includes('filled')) return 'filled';
  if (colorKey.includes('outlined')) return 'outlined';
  if (colorKey.includes('ghost')) return 'ghost';
  if (colorKey.includes('utility')) return 'utility';
  return null;
};

export const ButtonColorCategory: React.FC = () => (
  <ThemeAwareColorCategory category="button" groupBy={groupButtonColors} />
);
