import { BaseProps } from '@/types/globalTypes';
import { useFormGroupContext } from '../../FormGroupContext';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/web/UtilityBody';
import { UtilityLabel } from '@/components/Typography/Utility/UtilityLabel/web/UtilityLabel';
import styles from '../FormGroup.module.scss';
import classNames from 'classnames';

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
    <div className={classNames(styles.label)}>
      <UtilityLabel
        id={id}
        htmlFor={htmlForValue}
        // size and weight are always the same
        size="medium"
        weight="semibold"
        data-testid={dataTestId}
        as={'label'}
      >
        {children}
      </UtilityLabel>
      {optional && (
        <UtilityBody
          // size and weight are always the same
          size="xx-small"
          weight="regular"
          className={classNames(styles.optional)}
        >
          <span style={{ color: 'var(--color-text-on-light-tertiary)' }}>(Optional)</span>
        </UtilityBody>
      )}
    </div>
  );
};
