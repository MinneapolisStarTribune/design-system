import type { CodeBlockSizeType } from '../../types';
import type { DangerousCodeBlockProps } from '../DangerousCodeBlock/DangerousCodeBlock.types';

export interface EnhancedCodeBlockProps extends DangerousCodeBlockProps {
  size?: CodeBlockSizeType;
}
