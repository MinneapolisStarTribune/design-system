import React from 'react';
import type { ArticleToolkitBaseProps } from '../types';

export interface CodeBlockProps extends ArticleToolkitBaseProps {
  /** Placeholder - CodeBlock component (SUS-157) */
}

export const CodeBlock: React.FC<CodeBlockProps> = () => {
  return <div data-testid="code-block">CodeBlock (placeholder)</div>;
};

CodeBlock.displayName = 'CodeBlock';
