import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import { A11y, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import classNames from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from '@/icons';
import { Button } from '@/index.web';

import 'swiper/css';
import 'swiper/css/pagination';

import styles from './NewsletterCarousel.module.scss';

export interface NewsletterCarouselProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
}

export interface NewsletterCarouselItemProps {
    children: React.ReactNode;
    className?: string;
}

const Item: React.FC<NewsletterCarouselItemProps> = ({ children, className }) => (
    <div className={classNames(styles.item, className)}>
        {children}
    </div>
);
Item.displayName = 'NewsletterCarousel.Item';

type NewsletterCarouselComponent = React.FC<NewsletterCarouselProps> & {
    Item: typeof Item;
};

const NewsletterCarouselRoot: React.FC<NewsletterCarouselProps> = ({
    children,
    title,
    className,
}) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(true);

    // Wrap each Item child in a SwiperSlide
    const slides = useMemo(() =>
        React.Children.map(children, (child, i) => (
            <SwiperSlide key={i} className={styles.slide}>
                {child}
            </SwiperSlide>
        )) ?? [],
    [children]);

    const total = slides.length;

    const updateNavState = useCallback((swiper: SwiperType) => {
        setActiveIndex(swiper.realIndex ?? swiper.activeIndex);
        setCanPrev(!swiper.isBeginning);
        setCanNext(!swiper.isEnd);
    }, []);

    // Force layout recalc after mount — fixes Storybook iframe zero-width issue
    useEffect(() => {
        const id = requestAnimationFrame(() => {
            if (!swiperRef.current) return;
            swiperRef.current.update();
            updateNavState(swiperRef.current);
        });
        return () => cancelAnimationFrame(id);
    }, [updateNavState]);

    // Re-run on container resize
    useEffect(() => {
        const el = rootRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return;
        const ro = new ResizeObserver(() => {
            if (!swiperRef.current) return;
            swiperRef.current.update();
            updateNavState(swiperRef.current);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [updateNavState]);

    const prev = useCallback(() => swiperRef.current?.slidePrev(), []);
    const next = useCallback(() => swiperRef.current?.slideNext(), []);

    return (
        <div ref={rootRef} className={classNames(styles.root, className)}>
            {title && <h2 className={styles.title}>{title}</h2>}

            <SwiperReact
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                modules={[A11y, Pagination]}
                slidesPerView="auto"
                spaceBetween={24}
                allowTouchMove={true}
                grabCursor={true}
                watchSlidesProgress
                observer
                observeParents
                onSlideChange={updateNavState}
                onReachBeginning={(swiper) => { setCanPrev(false); setCanNext(!swiper.isEnd); }}
                onReachEnd={(swiper) => { setCanNext(false); setCanPrev(!swiper.isBeginning); }}
                className={styles.swiper}
            >
                {slides}
            </SwiperReact>

            <div className={styles.bottom}>
                <div className={styles.dots}>
                    {Array.from({ length: total }).map((_, i) => (
                        <button
                            key={i}
                            className={classNames(styles.dot, {
                                [styles.dotActive]: i === activeIndex,
                            })}
                            onClick={() => swiperRef.current?.slideTo(i)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>

                <div className={styles.controls}>
                    <Button
                        variant="ghost"
                        size="medium"
                        icon={<ChevronLeftIcon />}
                        aria-label="Previous"
                        onClick={prev}
                        isDisabled={!canPrev}
                        className={styles.navButton}
                    />
                    <Button
                        variant="ghost"
                        size="medium"
                        icon={<ChevronRightIcon />}
                        aria-label="Next"
                        onClick={next}
                        isDisabled={!canNext}
                        className={styles.navButton}
                    />
                </div>
            </div>
        </div>
    );
};

NewsletterCarouselRoot.displayName = 'NewsletterCarousel';

export const NewsletterCarousel = NewsletterCarouselRoot as NewsletterCarouselComponent;
NewsletterCarousel.Item = Item;