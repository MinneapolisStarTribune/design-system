import type { CodeBlockSizeType } from '../../types';
import type { BaseDangerousCodeBlockProps } from '../DangerousCodeBlock/DangerousCodeBlock.types';

export type BaseEnhancedCodeBlockProps = BaseDangerousCodeBlockProps & {
  size?: CodeBlockSizeType;
};
