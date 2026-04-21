import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PullQuoteProps } from '../PullQuote.types';
import { PullQuote } from './PullQuote.native';
import { ARTICLE_BODY_VARIANTS, PULL_QUOTE_SIZES } from '../../types';
import { ArticleBodyText } from '@/components/Typography/ArticleBody/ArticleBodyText/native/ArticleBodyText.native';
import { DesignSystemProvider, type Brand } from '@/providers/DesignSystemProvider.native';

const meta = {
  title: 'Editorial Content/Article Toolkit/Pull Quote',
  component: PullQuote,
  parameters: {
    layout: 'fullscreen',
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
      control: 'radio',
      options: PULL_QUOTE_SIZES,
      description: 'The size of the quote text.',
      table: {
        type: {
          summary: "'small' | 'large'",
        },
      },
    },
  },
} satisfies Meta<typeof PullQuote>;

export default meta;

type Story = StoryObj<typeof meta>;

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

function BrandStoryScope({ brand, children }: { brand: Brand; children: ReactNode }) {
  return (
    <DesignSystemProvider brand={brand} forceColorScheme="light">
      {children}
    </DesignSystemProvider>
  );
}

export const Configurable: Story = {
  args: storyArgs(),
};

export const AllVariants: Story = {
  args: storyArgs(),
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: (args) => {
    const { size: _size, ...baseArgs } = args as PullQuoteProps;
    const cases: {
      title: string;
      brand: Brand;
      props?: Partial<PullQuoteProps>;
      isContext?: boolean;
    }[] = [
      {
        title: 'Standard - Star Tribune - Large',
        brand: 'startribune',
        props: { variant: 'standard', size: 'large' },
      },
      {
        title: 'Standard - Star Tribune - Small',
        brand: 'startribune',
        props: { variant: 'standard', size: 'small' },
      },
      {
        title: 'Standard - Varsity - Large',
        brand: 'varsity',
        props: { variant: 'standard', size: 'large' },
      },
      {
        title: 'Standard - Varsity - Small',
        brand: 'varsity',
        props: { variant: 'standard', size: 'small' },
      },
      {
        title: 'Immersive - Star Tribune - Large',
        brand: 'startribune',
        props: { variant: 'immersive', size: 'large' },
      },
      {
        title: 'Immersive - Star Tribune - Small',
        brand: 'startribune',
        props: { variant: 'immersive', size: 'small' },
      },
      {
        title: 'Immersive - Varsity - Large',
        brand: 'varsity',
        props: { variant: 'immersive', size: 'large' },
      },
      {
        title: 'Immersive - Varsity - Small',
        brand: 'varsity',
        props: { variant: 'immersive', size: 'small' },
      },
      {
        title: 'Standard - Star Tribune - Large - In Article Context',
        brand: 'startribune',
        props: { variant: 'standard', size: 'large' },
        isContext: true,
      },
      {
        title: 'Standard - Star Tribune - Small - In Article Context',
        brand: 'startribune',
        props: { variant: 'standard', size: 'small' },
        isContext: true,
      },
      {
        title: 'Standard - Varsity - Large - In Article Context',
        brand: 'varsity',
        props: { variant: 'standard', size: 'large' },
        isContext: true,
      },
      {
        title: 'Standard - Varsity - Small - In Article Context',
        brand: 'varsity',
        props: { variant: 'standard', size: 'small' },
        isContext: true,
      },
      {
        title: 'Immersive - Star Tribune - Large - In Article Context',
        brand: 'startribune',
        props: { variant: 'immersive', size: 'large' },
        isContext: true,
      },
      {
        title: 'Immersive - Star Tribune - Small - In Article Context',
        brand: 'startribune',
        props: { variant: 'immersive', size: 'small' },
        isContext: true,
      },
      {
        title: 'Immersive - Varsity - Large - In Article Context',
        brand: 'varsity',
        props: { variant: 'immersive', size: 'large' },
        isContext: true,
      },
      {
        title: 'Immersive - Varsity - Small - In Article Context',
        brand: 'varsity',
        props: { variant: 'immersive', size: 'small' },
        isContext: true,
      },
    ];

    return (
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.scrollView}>
        <View style={styles.grid}>
          {cases.map(({ title, brand, props, isContext }) => {
            const finalProps = {
              ...baseArgs,
              ...props,
            };

            return (
              <View key={title} style={styles.case}>
                <Text style={styles.title}>{title}</Text>

                <BrandStoryScope brand={brand}>
                  {isContext ? (
                    <View style={styles.context}>
                      <ArticleBodyText>
                        It legalizes the possession and use of marijuana for Minnesotans 21 and
                        older. It creates a new state agency, called the Office of Cannabis
                        Management (OCM), tasked with licensing cannabis and hemp businesses and
                        overseeing a legal recreational market.
                      </ArticleBodyText>

                      <PullQuote {...finalProps} />

                      <ArticleBodyText>
                        Many elements of the law, including those pertaining to adult possession,
                        use and home cultivation of marijuana, took effect July 1, according to the
                        bill. However, the bill did not lift the existing criminal penalties for
                        these same provisions until Aug. 1.
                      </ArticleBodyText>
                    </View>
                  ) : (
                    <PullQuote {...finalProps} />
                  )}
                </BrandStoryScope>

                <View style={styles.separator} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  },
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  grid: {
    gap: 24,
  },
  case: {
    width: '100%',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  context: {
    width: '100%',
    maxWidth: 528,
    gap: 16,
    alignSelf: 'center',
  },
  separator: {
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    width: '100%',
  },
});
