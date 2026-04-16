import type { Meta, StoryObj } from '@storybook/react-vite';
import { PullQuoteProps } from '../PullQuote.types';
import { PullQuote } from './PullQuote';
import { ARTICLE_BODY_VARIANTS, PULL_QUOTE_SIZES } from '../../types';
import { ArticleBodyText } from '@/index.web';

const meta: Meta<PullQuoteProps> = {
  title: 'Editorial Content/Article Toolkit/Pull Quote',
  component: PullQuote,
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        type: 'dynamic',
      },
    },
  },
  argTypes: {
    quote: {
      control: 'text',
      description: 'The quote text to be displayed in the pull quote.',
    },
    attribution: {
      control: 'text',
      description: 'The name of the person being quoted.',
    },
    jobTitle: {
      control: 'text',
      description: 'The job title of the person being quoted.',
    },
    variant: {
      control: 'radio',
      options: Object.values(ARTICLE_BODY_VARIANTS),
      description: 'Article body variant: standard or immersive.',
      table: {
        type: {
          summary: "'standard' | 'immersive'",
        },
      },
    },
    size: {
      control: 'select',
      options: PULL_QUOTE_SIZES,
      description: 'The size of the quote text.',
      table: {
        type: {
          summary: "'small' | 'large'",
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<PullQuoteProps>;

const defaultArgs: PullQuoteProps = {
  quote: 'I still believe jurors can do the right thing and justice can be served.',
  attribution: 'Gov. Tim Walz',
  jobTitle: 'Governor, Minnesota',
  variant: 'standard',
  size: 'small',
};

const storyArgs = (overrides: Partial<PullQuoteProps> = {}): PullQuoteProps => ({
  ...defaultArgs,
  ...overrides,
});

export const Configurable: Story = {
  args: storyArgs(),
};

export const AllVariants: Story = {
  render: (args) => {
    const cases: {
      title: string;
      props?: Partial<PullQuoteProps>;
      isContext?: boolean;
    }[] = [
      {
        title: 'Standard - Large',
        props: { variant: 'standard', size: 'large' },
      },
      {
        title: 'Standard - Small',
        props: { variant: 'standard', size: 'small' },
      },
      {
        title: 'Immersive - Large',
        props: { variant: 'immersive', size: 'large' },
      },
      {
        title: 'Immersive - Small',
        props: { variant: 'immersive', size: 'small' },
      },
      {
        title: 'Standard - Large - In Article Context',
        props: { variant: 'standard', size: 'large' },
        isContext: true,
      },
      {
        title: 'Standard - Small - In Article Context',
        props: { variant: 'standard', size: 'small' },
        isContext: true,
      },
      {
        title: 'Immersive - Large - In Article Context',
        props: { variant: 'immersive', size: 'large' },
        isContext: true,
      },
      {
        title: 'Immersive - Small - In Article Context',
        props: { variant: 'immersive', size: 'small' },
        isContext: true,
      },
    ];

    return (
      <div style={{ display: 'grid', gap: '24px' }}>
        {cases.map(({ title, props, isContext }) => {
          const finalProps = {
            ...args,
            ...props,
          };

          return (
            <div key={title}>
              <h3 className="typography-article-body-h3">{title}</h3>

              {isContext ? (
                <div
                  style={{
                    maxWidth: '528px',
                    margin: '0 auto',
                  }}
                >
                  <ArticleBodyText>
                    It legalizes the possession and use of marijuana for Minnesotans 21 and older.
                    It creates a new state agency, called the Office of Cannabis Management (OCM),
                    tasked with licensing cannabis and hemp businesses and overseeing a legal
                    recreational market, as well as the existing medical cannabis and hemp-derived
                    markets. The law mandates the expungement of all misdemeanor marijuana offenses
                    and creates a Cannabis Expungement Board to review felony offenses for possible
                    expungement on a case-by-case basis. It also imposes new rules and requirements
                    for hemp-based THC drinks and edibles, which exploded in popularity after they
                    were legalized last year.
                  </ArticleBodyText>

                  <PullQuote {...finalProps} />

                  <ArticleBodyText>
                    Many elements of the law — including those pertaining to adult possession, use
                    and home cultivation of marijuana — took effect July 1, according to the bill.
                    However, the bill did not lift the existing criminal penalties for these same
                    provisions until Aug. 1.
                  </ArticleBodyText>

                  <ArticleBodyText>
                    According to a state website about the law, legal retail sales might not begin
                    until early 2025. However, the Red Lake Nation and White Earth Nation began
                    allowing recreational dispensaries to sell cannabis to non-tribal members in
                    August. Virtually all of the bill&apos;s changes to the state&apos;s medical
                    cannabis program take effect on March 1, 2025.
                  </ArticleBodyText>
                </div>
              ) : (
                <PullQuote {...finalProps} />
              )}

              <div
                style={{
                  marginTop: '24px',
                  borderBottom: '1px solid #e5e5e5',
                  width: '100%',
                }}
              />
            </div>
          );
        })}
      </div>
    );
  },
  args: storyArgs(),
};
