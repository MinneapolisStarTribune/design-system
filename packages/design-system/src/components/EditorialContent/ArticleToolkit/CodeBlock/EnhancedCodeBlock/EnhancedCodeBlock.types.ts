import type { DangerousCodeBlockProps } from '../DangerousCodeBlock/DangerousCodeBlock.types';

export type EnhancedCodeBlockProps = Omit<DangerousCodeBlockProps, 'className'>;
