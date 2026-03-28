import { useMemo, useState, type CSSProperties } from 'react';
import classNames from 'classnames';
import { Button } from '@/components/Button/web/Button';
import { UtilityLabel } from '@/components/Typography/Utility';
import { SectionHeading } from '@/components/Typography/Utility/SectionHeading/web/SectionHeading';
import { ChevronRightIcon } from '@/icons';
import categories from './component-matrix.json';
import { PLANNED_COMPONENTS } from './component-roadmap-config';
import styles from './ComponentRoadmap.module.scss';
import { ThemeCssLoader } from './ThemeCssLoader';

/** Category order follows first occurrence in the roadmap config. */
const ROADMAP_CATEGORIES = [...new Set(PLANNED_COMPONENTS.map((c) => c.category))];

type MatrixRow = { component: string; web: boolean; native: boolean };

type StatusFilter = 'all' | 'done' | 'todo';
type PlatformFilter = 'all' | 'web' | 'native';

type ComponentRow = (typeof PLANNED_COMPONENTS)[number] & {
  webDone: boolean;
  nativeDone: boolean;
  fullyDone: boolean;
};

function isDoneForFilters(c: ComponentRow, platformFilter: PlatformFilter): boolean {
  if (platformFilter === 'all') return c.fullyDone;
  if (platformFilter === 'web') return c.platform.includes('web') && c.webDone;
  return c.platform.includes('native') && c.nativeDone;
}

function isTodoForFilters(c: ComponentRow, platformFilter: PlatformFilter): boolean {
  if (platformFilter === 'all') return !c.fullyDone;
  if (platformFilter === 'web') return c.platform.includes('web') && !c.webDone;
  return c.platform.includes('native') && !c.nativeDone;
}

/** CSS custom properties consumed by `.metricCard` in the SCSS module. */
type MetricCardStyle = CSSProperties & {
  '--roadmap-accent'?: string;
  '--roadmap-metric-color'?: string;
};

export const ComponentRoadmap = () => {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('web');
  const [openSections, setOpenSections] = useState(() => new Set(ROADMAP_CATEGORIES));

  const builtLookup = useMemo(() => {
    const map = new Map<string, { web: boolean; native: boolean }>();
    const rows = categories as MatrixRow[];
    for (const row of rows) {
      map.set(String(row.component).toLowerCase().trim(), {
        web: row.web,
        native: row.native,
      });
    }
    return map;
  }, []);

  const components = useMemo(
    () =>
      PLANNED_COMPONENTS.map((planned) => {
        const built = builtLookup.get(planned.name.toLowerCase().trim());
        const webPlanned = planned.platform.includes('web');
        const nativePlanned = planned.platform.includes('native');
        const webDone = webPlanned && !!built?.web;
        const nativeDone = nativePlanned && !!built?.native;
        const fullyDone = (!webPlanned || webDone) && (!nativePlanned || nativeDone);
        return { ...planned, webDone, nativeDone, fullyDone };
      }),
    [builtLookup]
  );

  const stats = useMemo(() => {
    const webPlanned = components.filter((c) => c.platform.includes('web'));
    const nativePlanned = components.filter((c) => c.platform.includes('native'));
    return {
      total: components.length,
      totalDone: components.filter((c) => c.fullyDone).length,
      webPlanned: webPlanned.length,
      webDone: webPlanned.filter((c) => c.webDone).length,
      nativePlanned: nativePlanned.length,
      nativeDone: nativePlanned.filter((c) => c.nativeDone).length,
    };
  }, [components]);

  const totalPct = stats.total ? Math.round((stats.totalDone / stats.total) * 100) : 0;
  const webPct = stats.webPlanned ? Math.round((stats.webDone / stats.webPlanned) * 100) : 0;
  const nativePct = stats.nativePlanned
    ? Math.round((stats.nativeDone / stats.nativePlanned) * 100)
    : 0;

  /** Master progress line: matches the active platform filter (not “fully complete on both” when scoped). */
  const scopedProgress = useMemo(() => {
    if (platformFilter === 'all') {
      return {
        done: stats.totalDone,
        planned: stats.total,
        pct: totalPct,
        label: `${stats.totalDone} of ${stats.total} Components fully built`,
      };
    }
    if (platformFilter === 'web') {
      return {
        done: stats.webDone,
        planned: stats.webPlanned,
        pct: webPct,
        label: `${stats.webDone} of ${stats.webPlanned} Web Components built`,
      };
    }
    return {
      done: stats.nativeDone,
      planned: stats.nativePlanned,
      pct: nativePct,
      label: `${stats.nativeDone} of ${stats.nativePlanned} Native Components built`,
    };
  }, [platformFilter, stats, totalPct, webPct, nativePct]);

  const filtered = useMemo(() => {
    let list = components;
    if (platformFilter === 'web') list = list.filter((c) => c.platform.includes('web'));
    if (platformFilter === 'native') list = list.filter((c) => c.platform.includes('native'));
    if (filter === 'done') list = list.filter((c) => isDoneForFilters(c, platformFilter));
    if (filter === 'todo') list = list.filter((c) => isTodoForFilters(c, platformFilter));
    return list;
  }, [components, filter, platformFilter]);

  const toggleSection = (cat: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const metricCards: {
    label: string;
    done: number;
    planned: number;
    pct: number;
    cardStyle: MetricCardStyle;
  }[] = [
    {
      label: 'Web Components',
      done: stats.webDone,
      planned: stats.webPlanned,
      pct: webPct,
      cardStyle: {
        '--roadmap-accent': 'var(--color-icon-brand-02)',
        '--roadmap-metric-color': 'var(--color-icon-brand-02)',
      },
    },
    {
      label: 'Native Components',
      done: stats.nativeDone,
      planned: stats.nativePlanned,
      pct: nativePct,
      cardStyle: {
        '--roadmap-accent': 'var(--color-icon-brand-03)',
        '--roadmap-metric-color': 'inherit',
      },
    },
    {
      label: 'Fully Complete',
      done: stats.totalDone,
      planned: stats.total,
      pct: totalPct,
      cardStyle: {
        '--roadmap-accent': 'var(--color-text-state-success-on-light)',
        '--roadmap-metric-color': 'var(--color-text-state-success-on-light)',
      },
    },
  ];

  const metricCardsVisible = platformFilter === 'all' ? metricCards : metricCards.slice(0, 2);

  return (
    <>
      <ThemeCssLoader brand="startribune" colorScheme="light" />
      <SectionHeading importance={1}>Component Roadmap</SectionHeading>
      <div className={styles.wrap}>
        <div className={styles.progressRow}>
          <UtilityLabel size="small" className={styles.textSecondary}>
            {scopedProgress.label}
          </UtilityLabel>
          <UtilityLabel size="small" weight="semibold">
            {scopedProgress.pct}%
          </UtilityLabel>
        </div>
        <div className={styles.masterBar}>
          <div className={styles.masterBarFill} style={{ width: `${scopedProgress.pct}%` }} />
        </div>

        <div
          className={classNames(
            styles.metaGrid,
            platformFilter !== 'all' && styles.metaGridTwoCols
          )}
        >
          {metricCardsVisible.map(({ label, done, planned, pct, cardStyle }) => (
            <div key={label} className={styles.metricCard} style={cardStyle}>
              <UtilityLabel
                size="small"
                className={classNames(styles.textSecondary, styles.metricLabel)}
              >
                {label}
              </UtilityLabel>
              <div className={styles.metricValue}>
                <UtilityLabel size="large" weight="semibold" className={styles.metricValueMain}>
                  {done}
                </UtilityLabel>
                <UtilityLabel size="small" className={styles.metricFraction}>
                  {' '}
                  / {planned}
                </UtilityLabel>
              </div>
              <UtilityLabel
                size="small"
                className={classNames(styles.textTertiary, styles.metricSub)}
              >
                {pct}% done
              </UtilityLabel>
              <div className={styles.miniBar}>
                <div className={styles.miniBarFill} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.filterBar}>
          <UtilityLabel size="small" className={styles.textSecondary}>
            Status:
          </UtilityLabel>
          {(
            [
              ['all', 'All'],
              ['done', 'Built'],
              ['todo', 'Remaining'],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              type="button"
              variant="ghost"
              color="neutral"
              size="small"
              className={classNames(styles.filterPill, filter === key && styles.filterPillActive)}
              onClick={() => setFilter(key)}
            >
              {label}
            </Button>
          ))}
          <div className={styles.divider} role="presentation" />
          <UtilityLabel size="small" className={styles.textSecondary}>
            Platform:
          </UtilityLabel>
          {(
            [
              ['all', 'All'],
              ['web', 'Web'],
              ['native', 'Native'],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              type="button"
              variant="ghost"
              color="neutral"
              size="small"
              className={classNames(
                styles.filterPill,
                platformFilter === key && styles.filterPillActive
              )}
              onClick={() => setPlatformFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>

        {ROADMAP_CATEGORIES.map((cat) => {
          const catAll = components.filter((c) => c.category === cat);
          const catFiltered = filtered.filter((c) => c.category === cat);

          const webInCat = catAll.filter((c) => c.platform.includes('web'));
          const nativeInCat = catAll.filter((c) => c.platform.includes('native'));
          const webDoneInCat = webInCat.filter((c) => c.webDone).length;
          const nativeDoneInCat = nativeInCat.filter((c) => c.nativeDone).length;

          let totalSlots: number;
          let doneSlots: number;
          if (platformFilter === 'all') {
            totalSlots = webInCat.length + nativeInCat.length;
            doneSlots = webDoneInCat + nativeDoneInCat;
          } else if (platformFilter === 'web') {
            totalSlots = webInCat.length;
            doneSlots = webDoneInCat;
          } else {
            totalSlots = nativeInCat.length;
            doneSlots = nativeDoneInCat;
          }

          const catPct = totalSlots > 0 ? Math.round((doneSlots / totalSlots) * 100) : 0;
          const isComplete = totalSlots > 0 && catPct === 100;
          const isOpen = openSections.has(cat);

          if (catFiltered.length === 0) return null;

          return (
            <div key={cat} className={styles.section}>
              <button
                type="button"
                className={styles.sectionHeader}
                aria-expanded={isOpen}
                aria-label={`${cat}, ${isOpen ? 'expanded' : 'collapsed'}`}
                onClick={() => toggleSection(cat)}
              >
                <div className={styles.cluster}>
                  <ChevronRightIcon
                    size="x-small"
                    color="on-light-tertiary"
                    className={classNames(styles.chevron, isOpen && styles.chevronOpen)}
                    aria-hidden
                  />
                  <UtilityLabel size="medium" weight="semibold">
                    {cat}
                  </UtilityLabel>
                  {isComplete ? (
                    <UtilityLabel size="small" weight="semibold" className={styles.completeBadge}>
                      🎉 complete
                    </UtilityLabel>
                  ) : (
                    <UtilityLabel size="small" className={styles.textTertiary}>
                      {doneSlots}/{totalSlots} built
                    </UtilityLabel>
                  )}
                </div>
                <div className={styles.cluster}>
                  <div className={styles.sectionBar}>
                    <div
                      className={classNames(
                        styles.sectionBarFill,
                        isComplete && styles.sectionBarFillComplete
                      )}
                      style={{ width: `${catPct}%` }}
                    />
                  </div>
                  <UtilityLabel
                    size="small"
                    className={classNames(styles.textTertiary, styles.sectionPct)}
                  >
                    {catPct}%
                  </UtilityLabel>
                </div>
              </button>

              {isOpen && (
                <div>
                  {catFiltered.map((c) => {
                    const showWeb = platformFilter !== 'native' && c.platform.includes('web');
                    const showNative = platformFilter !== 'web' && c.platform.includes('native');
                    const rowDone = isDoneForFilters(c, platformFilter);
                    const bothPlanned = c.platform.includes('web') && c.platform.includes('native');
                    const bothBuilt = bothPlanned && c.webDone && c.nativeDone;
                    const showCombinedBothBuilt = bothBuilt && showWeb && showNative;
                    return (
                      <div key={c.name} className={styles.componentRow}>
                        <div className={styles.cluster}>
                          <div className={classNames(styles.dot, rowDone && styles.dotDone)} />
                          <UtilityLabel
                            size="small"
                            className={classNames(
                              styles.componentName,
                              rowDone && styles.componentNameDone
                            )}
                          >
                            {c.name}
                          </UtilityLabel>
                          {!rowDone && (
                            <UtilityLabel
                              size="small"
                              className={classNames(styles.textTertiary, styles.toBuildLabel)}
                            >
                              to build
                            </UtilityLabel>
                          )}
                        </div>
                        <div className={styles.badgeWrap}>
                          {c.platform.length === 0 ? (
                            <UtilityLabel
                              size="small"
                              className={classNames(styles.badge, styles.badgeTodo)}
                            >
                              TBD
                            </UtilityLabel>
                          ) : showCombinedBothBuilt ? (
                            <UtilityLabel
                              size="small"
                              className={classNames(styles.badge, styles.badgeDone)}
                            >
                              Both platforms built ✓
                            </UtilityLabel>
                          ) : (
                            <>
                              {showWeb && (
                                <UtilityLabel
                                  size="small"
                                  className={classNames(
                                    styles.badge,
                                    c.webDone ? styles.badgeDone : styles.badgeTodo
                                  )}
                                >
                                  {c.webDone ? 'Web ✓' : 'Web'}
                                </UtilityLabel>
                              )}
                              {showNative && (
                                <UtilityLabel
                                  size="small"
                                  className={classNames(
                                    styles.badge,
                                    c.nativeDone ? styles.badgeDone : styles.badgeTodo
                                  )}
                                >
                                  {c.nativeDone ? 'Native ✓' : 'Native'}
                                </UtilityLabel>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
