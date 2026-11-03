import classNames from 'classnames';
import styles from './ToggleGroup.module.scss';
import type { ToggleGroupDetailProps } from './ToggleGroup.types';

/**
 * Secondary text inside a `ToggleGroup.Item`, such as a result count. Smaller and lighter than the
 * label, and dimmed to suit the selected fill when its item is selected.
 */
export const ToggleGroupDetail: React.FC<ToggleGroupDetailProps> = ({
  children,
  className,
  style,
  dataTestId,
}) => (
  <span
    className={classNames(styles.detail, 'typography-utility-text-regular-small', className)}
    style={style}
    data-testid={dataTestId}
  >
    {children}
  </span>
);

ToggleGroupDetail.displayName = 'ToggleGroupDetail';
