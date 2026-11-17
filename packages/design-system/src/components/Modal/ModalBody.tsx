'use client';

import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.scss';
import { useModalContext } from './ModalContext';
import type { ModalSectionBaseProps } from './Modal.types';

/** Main content region; the only part of the panel that scrolls. */
export const ModalBody: React.FC<ModalSectionBaseProps> = ({
  children,
  className,
  dataTestId,
  componentName,
}) => {
  const { bodyId, setHasBody } = useModalContext(componentName);
  const bodyRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [fadeTop, setFadeTop] = useState(false);
  const [fadeBottom, setFadeBottom] = useState(false);

  useEffect(() => {
    setHasBody(true);

    return () => setHasBody(false);
  }, [setHasBody]);

  // Fade an edge while its sentinel is scrolled out of view, i.e. while content sits past it.
  useEffect(() => {
    const body = bodyRef.current;
    const start = startRef.current;
    const end = endRef.current;
    if (!body || !start || !end || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === start) setFadeTop(!entry.isIntersecting);
          if (entry.target === end) setFadeBottom(!entry.isIntersecting);
        }
      },
      { root: body }
    );
    observer.observe(start);
    observer.observe(end);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={bodyRef}
      id={bodyId}
      className={classNames('typography-utility-text-regular-small', styles.body, className)}
      data-testid={dataTestId}
      data-fade-top={fadeTop || undefined}
      data-fade-bottom={fadeBottom || undefined}
    >
      <div ref={startRef} aria-hidden="true" />
      {children}
      <div ref={endRef} aria-hidden="true" />
    </div>
  );
};

ModalBody.displayName = 'ModalBody';
