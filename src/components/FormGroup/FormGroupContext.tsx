import React, { createContext, useContext, useId } from 'react';

interface FormGroupContextValue {
  labelId: string | undefined;
  descriptionId: string | undefined;
  captionId: string | undefined;
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
  // Generate IDs upfront (hooks must be called unconditionally and in the same order)
  const rawLabelId = useId();
  const rawDescriptionId = useId();
  const rawCaptionId = useId();

  // Only expose IDs when the corresponding element is present
  const labelId = hasLabel ? rawLabelId : undefined;
  const descriptionId = hasDescription ? rawDescriptionId : undefined;
  const captionId = hasCaption ? rawCaptionId : undefined;

  const value: FormGroupContextValue = {
    labelId,
    descriptionId,
    captionId,
  };

  return <FormGroupContext.Provider value={value}>{children}</FormGroupContext.Provider>;
};
