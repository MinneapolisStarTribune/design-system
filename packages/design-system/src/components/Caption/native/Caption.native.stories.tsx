import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, Text, View } from 'react-native';
import { CAPTION_VARIANTS, type CaptionNativeProps } from '../Caption.types';
import { Caption } from './Caption.native';

const meta = {
  title: 'Editorial Content/Article Toolkit/Caption',
  component: Caption,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    caption: { control: 'object', description: 'Caption text' },
    credit: { control: 'text', description: 'Image attribution / credit' },
    variant: {
      control: 'radio',
      options: CAPTION_VARIANTS,
      description: 'Caption presentation variant',
    },
    purchaseLink: { control: 'object', description: 'Optional Buy Reprint CTA' },
    currentIndex: { control: 'number', description: 'Current pagination index' },
    totalItems: { control: 'number', description: 'Total number of items' },
  },
} satisfies Meta<CaptionNativeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultArgs: CaptionNativeProps = {
  caption:
    "Barb Dentz, an advocate with Tennessee Families for Vaccines, met with her state representative, Sam Whitson, to discuss the state's declining childhood immunization rates in January.",
  credit: 'Star Tribune staff/The Minnesota Star Tribune',
  variant: 'inline',
};

const storyArgs = (overrides: Partial<CaptionNativeProps> = {}): CaptionNativeProps => ({
  ...defaultArgs,
  ...overrides,
});

export const Configurable: Story = {
  args: storyArgs({
    purchaseLink: {
      label: 'Buy Reprint',
      link: 'https://www.startribune.com/photos',
    },
    currentIndex: 1,
    totalItems: 5,
  }),
  render: (args) => <Caption {...args} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },

  render: (args) => (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 40 }}>
      <View>
        <Text style={{ marginBottom: 8, fontWeight: '600' }}>Inline</Text>
        <Caption {...args} variant="inline" />
      </View>

      <View>
        <Text style={{ marginBottom: 8, fontWeight: '600' }}>Inline With Buy Reprint</Text>
        <Caption
          {...args}
          variant="inline"
          purchaseLink={{
            label: 'Buy Reprint',
            link: 'https://www.startribune.com/photos',
          }}
        />
      </View>

      <View>
        <Text style={{ marginBottom: 8, fontWeight: '600' }}>Gallery Caption</Text>
        <Caption
          {...args}
          variant="inline"
          purchaseLink={{
            label: 'Buy Reprint',
            link: 'https://www.startribune.com/photos',
          }}
          currentIndex={2}
          totalItems={17}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </View>

      <View
        style={{
          backgroundColor: '#111',
          padding: 24,
          borderRadius: 12,
        }}
      >
        <Text style={{ marginBottom: 8, fontWeight: '600', color: '#fff' }}>Lightbox</Text>
        <Caption
          {...args}
          variant="lightbox"
          purchaseLink={{
            label: 'Buy Reprint',
            link: 'https://www.startribune.com/photos',
          }}
          currentIndex={1}
          totalItems={17}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </View>

      <View
        style={{
          backgroundColor: '#111',
          padding: 24,
          borderRadius: 12,
        }}
      >
        <Text style={{ marginBottom: 8, fontWeight: '600', color: '#fff' }}>
          Lightbox Without Buy Reprint
        </Text>
        <Caption
          {...args}
          variant="lightbox"
          currentIndex={1}
          totalItems={17}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </View>

      <View>
        <Text style={{ marginBottom: 8, fontWeight: '600' }}>Without Credit</Text>
        <Caption {...args} credit={undefined} />
      </View>

      <View>
        <Text style={{ marginBottom: 8, fontWeight: '600' }}>Without Caption</Text>
        <Caption {...args} caption={undefined} />
      </View>

      <View>
        <Text style={{ marginBottom: 8, fontWeight: '600' }}>Caption Only</Text>
        <Caption caption="A scenic view of mountains during sunrise." />
      </View>
    </ScrollView>
  ),

  args: storyArgs(),
};
