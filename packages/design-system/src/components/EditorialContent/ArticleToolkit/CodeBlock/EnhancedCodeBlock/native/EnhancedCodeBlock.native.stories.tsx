import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ARTICLE_BODY_VARIANTS, CODE_BLOCK_SIZES } from '../../../types';
import { EnhancedCodeBlock } from './EnhancedCodeBlock.native';

const meta = {
  title: 'Editorial Content/Article Toolkit/Code Block/Enhanced Code Block',
  component: EnhancedCodeBlock,
  argTypes: {
    variant: {
      control: 'radio',
      options: [ARTICLE_BODY_VARIANTS.STANDARD, ARTICLE_BODY_VARIANTS.IMMERSIVE],
      description: 'Layout variant of the code block',
    },
    size: {
      control: 'select',
      options: CODE_BLOCK_SIZES,
      description: 'Size constraint of the code block',
    },
    cleanQuotes: {
      control: 'boolean',
      description: 'Whether to clean smart quotes in the markup',
    },
    markup: {
      control: 'text',
      description: 'Raw HTML markup injected into the WebView',
    },
  },
} satisfies Meta<typeof EnhancedCodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample markup for code blocks
const enhancedCodeBlockMarkup = `
  <div style="padding: 20px; background-color: #e3f2fd; border: 2px solid #2196F3; border-radius: 8px; width: 100%;">
    <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">Enhanced Code Block</h3>
    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5;">This evaluates raw HTML but dynamically applies correct width bounds based on its size prop.</p>
    <div style="height: 100px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; font-weight: 500;">
      Interactive Content Area
    </div>
  </div>
`;

export const Configurable: Story = {
  render: (args) => (
    <ScrollView contentContainerStyle={styles.scroll} style={styles.scrollView}>
      <View style={styles.container}>
        <EnhancedCodeBlock {...args} style={styles.blockContainer} />
      </View>
    </ScrollView>
  ),
  args: {
    markup: enhancedCodeBlockMarkup,
    variant: 'standard',
    size: 'full',
    cleanQuotes: true,
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: (args) => (
    <ScrollView contentContainerStyle={styles.scroll} style={styles.scrollView}>
      <View style={styles.container}>
        {[ARTICLE_BODY_VARIANTS.STANDARD, ARTICLE_BODY_VARIANTS.IMMERSIVE].map((variant) =>
          CODE_BLOCK_SIZES.map((size) => (
            <View key={`${variant}-${size}`}>
              <Text style={styles.sectionTitle}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)} -{' '}
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </Text>
              <EnhancedCodeBlock
                {...args}
                variant={variant}
                size={size}
                markup={enhancedCodeBlockMarkup}
                style={styles.blockContainer}
              />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  ),
  args: {
    markup: enhancedCodeBlockMarkup,
    cleanQuotes: true,
  },
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scroll: {
    paddingVertical: 16,
    gap: 24,
  },
  container: {
    gap: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  blockContainer: {
    height: 250,
  },
});
