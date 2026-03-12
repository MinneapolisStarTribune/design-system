import React, {
    useRef,
    useState,
    useEffect,
    useContext,
    createContext,
    useMemo,
} from 'react';
import {
    Swiper as SwiperReact,
    SwiperSlide,
} from 'swiper/react';
import { Navigation, A11y, Pagination, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import classNames from 'classnames';

import styles from './SwiperCarousel.module.scss';
import { Button } from '@/index.web';

/* ─── Constants ─────────────────────────────────────────── */

/** Responsive spaceBetween values (px). */
const SPACE_BETWEEN = {
    mobile: 8,
    tablet: 16,
    desktop: 24,
} as const;

/** Viewport breakpoints (px). */
const BREAKPOINT = {
    mobile: 640,
    tablet: 1024,
} as const;

/** Coverflow effect config for immersive-style layouts. */
const COVERFLOW_EFFECT = {
    rotate: 0,
    stretch: 0,
    depth: 0,
    modifier: 1,
    slideShadows: true,
} as const;

/** Returns the correct spaceBetween value for the current viewport. */
const getSpaceBetween = (): number => {
    const width = window.innerWidth;
    if (width < BREAKPOINT.mobile) return SPACE_BETWEEN.mobile;
    if (width < BREAKPOINT.tablet) return SPACE_BETWEEN.tablet;
    return SPACE_BETWEEN.desktop;
};

/* ─── Context ────────────────────────────────────────────── */

interface SwiperCarouselContextValue {
    /** Zero-based index of the currently active slide. */
    activeIndex: number;
    /** Total number of slides. */
    total: number;
    /** Navigate to the previous slide. */
    prev: () => void;
    /** Navigate to the next slide. */
    next: () => void;
    /** Whether the carousel loops infinitely. */
    loop: boolean;
}

const SwiperCarouselContext = createContext<SwiperCarouselContextValue | null>(null);

const useSwiperCarousel = (): SwiperCarouselContextValue => {
    const ctx = useContext(SwiperCarouselContext);
    if (!ctx) {
        throw new Error(
            'SwiperCarousel subcomponents must be rendered inside <SwiperCarousel>.'
        );
    }
    return ctx;
};

/* ─── Types ──────────────────────────────────────────────── */

/** Supported Swiper visual effects. */
export type SwiperCarouselEffect = 'coverflow';

/**
 * Props for the `SwiperCarousel` root component.
 *
 * ### Compound component pattern
 * Use the built-in subcomponents for pagination and navigation:
 *
 * ```tsx
 * <SwiperCarousel loop slidesPerView="auto">
 *   <SwiperCarousel.Slide><ArticleCard /></SwiperCarousel.Slide>
 *   <SwiperCarousel.Slide><ArticleCard /></SwiperCarousel.Slide>
 *   <SwiperCarousel.Pagination />
 * </SwiperCarousel>
 * ```
 *
 * Or render your own controls using the `useSwiperCarousel` hook
 * for full customisation without losing the shared state.
 */
export interface SwiperCarouselProps {
    /** Slide content — use `<SwiperCarousel.Slide>` for each item. */
    children: React.ReactNode;
    /**
     * Number of slides visible at once, or `'auto'` to let CSS control width.
     * @default 1
     */
    slidesPerView?: number | 'auto';
    /**
     * Centre the active slide — typically used with `slidesPerView='auto'`
     * so adjacent slides peek in from both sides.
     * @default false
     */
    centeredSlides?: boolean;
    /**
     * Infinite loop mode. When `true`, prev/next buttons are never disabled.
     * @default false
     */
    loop?: boolean;
    /** Visual effect applied to slide transitions. */
    effect?: SwiperCarouselEffect;
    /**
     * Called with the new zero-based index whenever the active slide changes.
     * In loop mode this is the `realIndex` (not the internal cloned index).
     */
    onSlideChange?: (index: number) => void;
    /** Additional className applied to the Swiper root element. */
    className?: string;
}

/* ─── Subcomponent: Slide ────────────────────────────────── */

/** Props for `SwiperCarousel.Slide`. */
export interface SwiperCarouselSlideProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Wrapper around `SwiperSlide`. Use one per carousel item.
 *
 * ```tsx
 * <SwiperCarousel.Slide>
 *   <ArticleCard {...props} />
 * </SwiperCarousel.Slide>
 * ```
 */
const Slide: React.FC<SwiperCarouselSlideProps> = ({ children, className }) => (
    <SwiperSlide className={className}>{children}</SwiperSlide>
);

Slide.displayName = 'SwiperCarousel.Slide';

/* ─── Subcomponent: Pagination ───────────────────────────── */

/** Props for `SwiperCarousel.Pagination`. */
export interface SwiperCarouselPaginationProps {
    /** Additional className on the pagination wrapper. */
    className?: string;
}

/**
 * Renders previous/next navigation buttons with automatic disabled states.
 *
 * - In **loop** mode both buttons are always enabled.
 * - In **non-loop** mode the prev button is disabled on the first slide
 *   and the next button is disabled on the last slide.
 *
 * Must be rendered inside `<SwiperCarousel>`.
 *
 * ```tsx
 * <SwiperCarousel>
 *   ...slides...
 *   <SwiperCarousel.Pagination />
 * </SwiperCarousel>
 * ```
 */
const PaginationControls: React.FC<SwiperCarouselPaginationProps> = ({ className }) => {
    const { activeIndex, total, prev, next, loop } = useSwiperCarousel();

    return (
        <div
            className={classNames(styles.pagination, className)}
            data-testid="swiper-carousel-pagination"
        >
            <Button
                variant="ghost"
                size="medium"
                icon="chevron-left"
                aria-label="Previous slide"
                onClick={prev}
                isDisabled={!loop && activeIndex === 0}
                className={styles.navButton}
            />
            <Button
                variant="ghost"
                size="medium"
                icon="chevron-right"
                aria-label="Next slide"
                onClick={next}
                isDisabled={!loop && activeIndex === total - 1}
                className={styles.navButton}
            />
        </div>
    );
};

PaginationControls.displayName = 'SwiperCarousel.Pagination';

/* ─── Root component ─────────────────────────────────────── */

type SwiperCarouselComponent = React.FC<SwiperCarouselProps> & {
    /** Wrap each carousel item in this. */
    Slide: typeof Slide;
    /**
     * Renders prev/next navigation buttons with automatic disabled states.
     * Place anywhere inside `<SwiperCarousel>`.
     */
    Pagination: typeof PaginationControls;
};


/**
 * Reusable Swiper carousel wrapper with a compound component API.
 *
 * Handles: Swiper instance ref, activeIndex state, responsive spaceBetween,
 * loop mode, coverflow effect, and exposes context for subcomponents.
 *
 * ### Basic usage
 * ```tsx
 * <SwiperCarousel slidesPerView="auto">
 *   <SwiperCarousel.Slide><ArticleCard /></SwiperCarousel.Slide>
 *   <SwiperCarousel.Slide><ArticleCard /></SwiperCarousel.Slide>
 * </SwiperCarousel>
 * ```
 *
 * ### With pagination controls
 * ```tsx
 * <SwiperCarousel slidesPerView="auto">
 *   <SwiperCarousel.Slide><PodcastCard /></SwiperCarousel.Slide>
 *   <SwiperCarousel.Slide><PodcastCard /></SwiperCarousel.Slide>
 *   <SwiperCarousel.Pagination />
 * </SwiperCarousel>
 * ```
 *
 * ### Immersive / looping with coverflow
 * ```tsx
 * <SwiperCarousel loop centeredSlides slidesPerView="auto" effect="coverflow">
 *   <SwiperCarousel.Slide><img src="..." alt="..." /></SwiperCarousel.Slide>
 *   <SwiperCarousel.Pagination />
 * </SwiperCarousel>
 * ```
 *
 * ### Custom controls via hook
 * ```tsx
 * const { activeIndex, total, prev, next } = useSwiperCarousel();
 * ```
 */
const SwiperCarouselRoot: React.FC<SwiperCarouselProps> = ({
    children,
    slidesPerView = 1,
    centeredSlides = false,
    loop = false,
    effect,
    onSlideChange,
    className,
}) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [spaceBetween, setSpaceBetween] = useState<number>(SPACE_BETWEEN.desktop);

    // Count direct SwiperSlide children to drive disabled logic.
    const total = React.Children.count(
        React.Children.toArray(children).filter(
            (child) =>
                React.isValidElement(child) &&
                (child.type === Slide || child.type === SwiperSlide)
        )
    );

    useEffect(() => {
        const handleResize = (): void => setSpaceBetween(getSpaceBetween());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSlideChange = (swiper: SwiperType): void => {
        const index = loop ? swiper.realIndex : swiper.activeIndex;
        setActiveIndex(index);
        onSlideChange?.(index);
    };

    const prev = (): void => {
        swiperRef.current?.slidePrev();
    };

    const next = (): void => {
        swiperRef.current?.slideNext();
    };

    const contextValue = useMemo<SwiperCarouselContextValue>(
        () => ({ activeIndex, total, prev, next, loop }),
        [activeIndex, total, loop]
    );

    return (
        <SwiperCarouselContext.Provider value={contextValue}>
            <div className={classNames(styles.root, className)} data-testid="swiper-carousel">
                <SwiperReact
                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                    modules={[Navigation, A11y, Pagination, EffectCoverflow]}
                    slidesPerView={slidesPerView}
                    centeredSlides={centeredSlides}
                    effect={effect}
                    coverflowEffect={effect === 'coverflow' ? COVERFLOW_EFFECT : undefined}
                    spaceBetween={spaceBetween}
                    loop={loop}
                    allowTouchMove={false}
                    grabCursor={false}
                    watchSlidesProgress
                    onSlideChange={handleSlideChange}
                    className={styles.swiper}
                >
                    {children}
                </SwiperReact>
            </div>
        </SwiperCarouselContext.Provider>
    );
};

SwiperCarouselRoot.displayName = 'SwiperCarousel';

export const SwiperCarousel = SwiperCarouselRoot as SwiperCarouselComponent;
SwiperCarousel.Slide = Slide;
SwiperCarousel.Pagination = PaginationControls;

export { useSwiperCarousel };