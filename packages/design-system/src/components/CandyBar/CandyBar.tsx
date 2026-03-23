import styles from './CandyBar.module.scss';
import { CloseIcon } from '@/icons';

export type CandyBarProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const CandyBar: React.FC<CandyBarProps> = ({ children, onClose }) => {
  return (
    <div className={styles.container}>
      <div className={styles.candyBar}>
        {children}
        <button
          type="button"
          aria-label="Dismiss candy bar"
          className={styles.closeButton}
          onClick={onClose}
        >
          <CloseIcon size="x-small" />
        </button>
      </div>
    </div>
  );
};
