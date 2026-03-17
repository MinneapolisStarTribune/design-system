import React from 'react';
import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from '../../FormGroupContext';
import classNames from 'classnames';
import styles from '../FormGroup.module.scss';

export interface FormGroupDescriptionProps extends BaseProps {
  children: React.ReactNode;
  id?: string;
}

export const FormGroupDescription: React.FC<FormGroupDescriptionProps> = ({
  children,
  id: idProp,
  dataTestId,
}) => {
  const context = useFormGroupContext();
  const id = idProp ?? context?.descriptionId;

  return (
    <span
      id={id}
      data-testid={dataTestId}
      className={classNames('typography-utility-text-regular-x-small', styles.description)}
    >
      {children}
    </span>
  );
};
