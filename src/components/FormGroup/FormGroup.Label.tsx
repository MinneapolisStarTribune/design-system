import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from './FormGroupContext';
import { UtilityBody } from '../Typography/Utility/UtilityBody/UtilityBody';
import { UtilityLabel } from '../Typography/Utility/UtilityLabel/UtilityLabel';
import styles from './FormGroup.module.scss';

export interface FormGroupLabelProps extends BaseProps {
  children: React.ReactNode;
  element?: string;
  id?: string;
  htmlFor?: string;
  optional?: boolean;
}

export const FormGroupLabel: React.FC<FormGroupLabelProps> = ({
  children,
  id: idProp,
  htmlFor,
  optional = false,
  dataTestId,
}) => {
  const context = useFormGroupContext();
  const id = idProp ?? context?.labelId;
  const htmlForValue = htmlFor ?? context?.inputId;

  return (
    <div className={styles.label}>
      <UtilityLabel
        id={id}
        htmlFor={htmlForValue}
        // size and weight are always the same
        size="medium"
        weight="semibold"
        data-testid={dataTestId}
      >
        {children}
      </UtilityLabel>
      {optional && (
        <UtilityBody
          // size and weight are always the same
          size="xx-small"
          weight="regular"
          className={styles.optional}
        >
          <div style={{ color: 'var(--color-text-on-light-tertiary)' }}>(Optional)</div>
        </UtilityBody>
      )}
    </div>
  );
};
