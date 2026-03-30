import React from 'react';
import classNames from 'classnames';
import { ArticleBodySponsoredText } from '@/components/Typography/ArticleBody/ArticleBodySponsoredText/web/ArticleBodySponsoredText';
import { ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS } from '@/components/Typography/ArticleBody/ArticleBodySponsoredText/ArticleBodySponsoredText.types';
import { ArticleBodyText } from '@/components/Typography/ArticleBody/ArticleBodyText/web/ArticleBodyText';
import { EditorialSponsoredText } from '@/components/Typography/Editorial/EditorialSponsoredText/web/EditorialSponsoredText';
import { EditorialText } from '@/components/Typography/Editorial/EditorialText/web/EditorialText';
import {
  EDITORIAL_SPONSORED_TEXT_SIZES,
  EDITORIAL_SPONSORED_TEXT_WEIGHTS,
} from '@/components/Typography/Editorial/EditorialSponsoredText/EditorialSponsoredText.types';
import {
  EDITORIAL_TEXT_SIZES,
  EDITORIAL_TEXT_WEIGHTS,
} from '@/components/Typography/Editorial/EditorialText/EditorialText.types';
import { UtilityBody } from '@/components/Typography/Utility/UtilityBody/web/UtilityBody';
import { UTILITY_BODY_SIZES } from '@/components/Typography/Utility/UtilityBody/UtilityBody.types';
import {
  ARTICLE_BODY_TEXT_WEIGHTS_FOR_INLINE,
  FIGMA_EDITORIAL_SIZE_TO_DS,
  INLINE_LINK_STORYBOOK_PREVIEW_HREF,
  UTILITY_BODY_WEIGHTS_FOR_INLINE,
} from '../inlineLinkTypographyMatrix';
import type { InlineLinkBrand } from '../InlineLink.types';
import { InlineLink } from './InlineLink';
import styles from './InlineLinkTypographyVariantShowcase.module.scss';

function figmaEditorialSizeKey(dsSize: string): string {
  const hit = Object.entries(FIGMA_EDITORIAL_SIZE_TO_DS).find(([, v]) => v === dsSize);
  return hit ? hit[0] : dsSize;
}

function VariantCaption({ label }: { label: string }) {
  return (
    <div className={classNames('typography-utility-text-regular-xx-small', styles.variantCaption)}>{label}</div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={classNames('typography-utility-text-semibold-small', styles.sectionHeading)}>{children}</h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className={classNames('typography-utility-text-medium-x-small', styles.subHeading)}>{children}</h3>;
}

const sample = (brand: InlineLinkBrand) => (
  <>
    Sample sentence with an{' '}
    <InlineLink brand={brand} href={INLINE_LINK_STORYBOOK_PREVIEW_HREF}>
      link
    </InlineLink>
    .
  </>
);

export interface InlineLinkTypographyVariantShowcaseProps {
  /** Alternate brands per row so both palettes are visible without changing the toolbar */
  brand?: InlineLinkBrand;
}

/**
 * Renders **every** DS-supported parent + size/weight combo used with **`InlineLink`** (Storybook **All variants**).
 */
export const InlineLinkTypographyVariantShowcase: React.FC<InlineLinkTypographyVariantShowcaseProps> = ({
  brand = 'startribune',
}) => {
  return (
    <div className={styles.showcaseRoot}>
      <p className={classNames('typography-utility-text-regular-small', styles.intro)}>
        Each cell is one **text variant** (parent + props). **`InlineLink`** only sets **`brand`** (here:{' '}
        <strong>{brand}</strong>). Toggle Storybook **Brand** / **theme** for <code>color.link</code> checks.
      </p>

      <SectionHeading>EditorialText — editorial/text / (regular | bold) / xxs…xl</SectionHeading>
      {EDITORIAL_TEXT_WEIGHTS.map((weight) => (
        <React.Fragment key={weight}>
          <SubHeading>weight=&quot;{weight}&quot;</SubHeading>
          <div className={styles.variantGrid}>
            {EDITORIAL_TEXT_SIZES.map((size) => (
              <div key={`${weight}-${size}`} className={styles.variantRow}>
                <VariantCaption
                  label={`Figma: editorial/text/${weight}/${figmaEditorialSizeKey(size)} · <EditorialText size="${size}" weight="${weight}" />`}
                />
                <EditorialText size={size} weight={weight}>
                  {sample(brand)}
                </EditorialText>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}

      <SectionHeading>ArticleBodyText — editorial/article/body / (regular | italic | bold | bold-italic)</SectionHeading>
      <div className={styles.variantGrid}>
        {ARTICLE_BODY_TEXT_WEIGHTS_FOR_INLINE.map((weight) => (
          <div key={weight} className={styles.variantRow}>
            <VariantCaption
              label={`Figma: editorial/article/body/${weight} · <ArticleBodyText weight="${weight}" />`}
            />
            <ArticleBodyText weight={weight}>{sample(brand)}</ArticleBodyText>
          </div>
        ))}
      </div>

      <SectionHeading>
        EditorialSponsoredText — editorial/text/sponsored / (regular | bold) / xxs…xl
      </SectionHeading>
      {EDITORIAL_SPONSORED_TEXT_WEIGHTS.map((weight) => (
        <React.Fragment key={weight}>
          <SubHeading>weight=&quot;{weight}&quot;</SubHeading>
          <div className={styles.variantGrid}>
            {EDITORIAL_SPONSORED_TEXT_SIZES.map((size) => (
              <div key={`${weight}-${size}`} className={styles.variantRow}>
                <VariantCaption
                  label={`Figma: editorial/text/sponsored/${weight}/${figmaEditorialSizeKey(size)} · <EditorialSponsoredText size="${size}" weight="${weight}" />`}
                />
                <EditorialSponsoredText size={size} weight={weight}>
                  {sample(brand)}
                </EditorialSponsoredText>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}

      <SectionHeading>
        ArticleBodySponsoredText — editorial/article/body/sponsored / (regular | italic | semibold | semibold-italic)
      </SectionHeading>
      <div className={styles.variantGrid}>
        {ARTICLE_BODY_SPONSORED_TEXT_WEIGHTS.map((weight) => (
          <div key={weight} className={styles.variantRow}>
            <VariantCaption
              label={`Figma: editorial/article/body/sponsored/${weight} · <ArticleBodySponsoredText weight="${weight}" />`}
            />
            <ArticleBodySponsoredText weight={weight}>{sample(brand)}</ArticleBodySponsoredText>
          </div>
        ))}
      </div>

      <SectionHeading>UtilityBody — utility/text / (regular | medium | semibold) / xx-small…x-large</SectionHeading>
      {UTILITY_BODY_WEIGHTS_FOR_INLINE.map((weight) => (
        <React.Fragment key={weight}>
          <SubHeading>weight=&quot;{weight}&quot; → utility/text/{weight}/…</SubHeading>
          <div className={styles.variantGrid}>
            {UTILITY_BODY_SIZES.map((size) => (
              <div key={`${weight}-${size}`} className={styles.variantRow}>
                <VariantCaption
                  label={`Figma: utility/text/${weight}/${figmaEditorialSizeKey(size)} · <UtilityBody size="${size}" weight="${weight}" />`}
                />
                <UtilityBody size={size} weight={weight}>
                  {sample(brand)}
                </UtilityBody>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

InlineLinkTypographyVariantShowcase.displayName = 'InlineLinkTypographyVariantShowcase';
