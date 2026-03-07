import React, { createContext, useContext, useId } from 'react';

interface FormGroupContextValue {
  labelId: string | undefined;
  descriptionId: string | undefined;
  captionId: string | undefined;
  inputId: string;
}

const FormGroupContext = createContext<FormGroupContextValue | null>(null);

export const useFormGroupContext = () => {
  const context = useContext(FormGroupContext);
  return context;
};

interface FormGroupProviderProps {
  children: React.ReactNode;
  hasLabel: boolean;
  hasDescription: boolean;
  hasCaption: boolean;
}

export const FormGroupProvider: React.FC<FormGroupProviderProps> = ({
  children,
  hasLabel,
  hasDescription,
  hasCaption,
}) => {
  // Generate IDs upfront (following Rules of Hooks - always call in same order)
  const rawLabelId = useId();
  const rawDescriptionId = useId();
  const rawCaptionId = useId();
  const inputId = useId();

  // Only expose IDs when the corresponding element is present
  const labelId = hasLabel ? `label-${rawLabelId}` : undefined;
  const descriptionId = hasDescription ? `description-${rawDescriptionId}` : undefined;
  const captionId = hasCaption ? `caption-${rawCaptionId}` : undefined;

  const value: FormGroupContextValue = {
    labelId,
    descriptionId,
    captionId,
    inputId,
  };

  return <FormGroupContext.Provider value={value}>{children}</FormGroupContext.Provider>;
};
