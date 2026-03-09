import React from 'react';
import type { ArticleToolkitBaseProps } from '../types';

/** Placeholder - CodeBlock component (SUS-157) */
export type CodeBlockProps = ArticleToolkitBaseProps;

export const CodeBlock: React.FC<CodeBlockProps> = () => {
  return <div data-testid="code-block">CodeBlock (placeholder)</div>;
};

CodeBlock.displayName = 'CodeBlock';
