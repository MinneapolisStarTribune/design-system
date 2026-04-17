import type { Meta, StoryObj } from '@storybook/react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ARTICLE_BODY_VARIANTS } from '../../../types';
import { DangerousCodeBlock } from './DangerousCodeBlock.native';

const meta = {
  title: 'Editorial Content/Article Toolkit/Code Block/Dangerous Code Block',
  component: DangerousCodeBlock,
  argTypes: {
    variant: {
      control: 'radio',
      options: [ARTICLE_BODY_VARIANTS.STANDARD, ARTICLE_BODY_VARIANTS.IMMERSIVE],
      description: 'Layout variant of the code block',
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
} satisfies Meta<typeof DangerousCodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample markup for code blocks (with smart quotes)
const dangerousCodeBlockMarkup = `
  <div style="padding: 20px; background-color: #e3f2fd; border: 2px solid #2196F3; border-radius: 8px; width: 100%;">
    <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">"Dangerous Code Block"</h3>
    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5;">This example renders raw 'HTML' and executes scripts.</p>
    <div style="height: 100px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; font-weight: 500;">
      Interactive Content Area
    </div>
    <script>
      console.log('Dangerous code block initialized');
    </script>
  </div>
`;

export const Configurable: Story = {
  render: (args) => (
    <ScrollView contentContainerStyle={styles.scroll} style={styles.scrollView}>
      <View style={styles.container}>
        <DangerousCodeBlock {...args} />
      </View>
    </ScrollView>
  ),
  args: {
    markup: dangerousCodeBlockMarkup,
    variant: 'standard',
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
        <Text style={styles.sectionTitle}>Standard Variant</Text>
        <DangerousCodeBlock
          {...args}
          variant="standard"
          markup={dangerousCodeBlockMarkup}
          style={styles.blockContainer}
        />

        <Text style={styles.sectionTitle}>Immersive Variant</Text>
        <DangerousCodeBlock
          {...args}
          variant="immersive"
          markup={dangerousCodeBlockMarkup}
          style={styles.blockContainer}
        />
      </View>
    </ScrollView>
  ),
  args: {
    markup: dangerousCodeBlockMarkup,
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
    marginBottom: 12,
  },
  blockContainer: {
    height: 250,
    marginBottom: 16,
  },
});
