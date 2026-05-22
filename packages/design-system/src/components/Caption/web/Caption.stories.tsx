import type { Meta, StoryObj } from '@storybook/react-vite';
import { Caption } from './Caption';
import { CAPTION_VARIANTS, type CaptionProps } from '../Caption.types';

const meta: Meta<CaptionProps> = {
  title: 'Editorial Content/Article Toolkit/Caption',
  component: Caption,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    caption: {
      control: 'text',
      description: 'Caption text',
    },
    credit: {
      control: 'text',
      description: 'Image attribution / credit',
    },
    variant: {
      control: 'radio',
      options: CAPTION_VARIANTS,
      description: 'Caption presentation variant',
    },
    purchaseLink: {
      control: 'object',
      description: 'Optional Buy Reprint CTA',
    },
    analytics: {
      control: 'object',
      description: 'Analytics metadata for Buy Reprint tracking',
    },
    currentIndex: {
      control: 'number',
      description: 'Current pagination index',
    },
    totalItems: {
      control: 'number',
      description: 'Total number of items',
    },
  },
};

export default meta;

type Story = StoryObj<CaptionProps>;

const defaultArgs: CaptionProps = {
  caption:
    'Barb Dentz, an advocate with Tennessee Families for Vaccines, met with her state representative, Sam Whitson, to discuss the state’s declining childhood immunization rates in January. (Rebecca McApline, Star Tribune)',
  credit: 'Star Tribune staff/The Minnesota Star Tribune',
  variant: 'inline',
};

const storyArgs = (overrides: Partial<CaptionProps> = {}): CaptionProps => ({
  ...defaultArgs,
  ...overrides,
});

// identifier: configurable
export const Configurable: Story = {
  args: storyArgs({
    purchaseLink: {
      label: 'Buy Reprint',
      link: 'https://www.startribune.com/photos',
    },
    currentIndex: 1,
    totalItems: 5,
  }),
  parameters: {
    docs: {
      source: {
        code: `
<Caption
  caption="A scenic view of mountains during sunrise, highlighting nature's beauty."
  credit="Star Tribune staff/The Minnesota Star Tribune"
  variant="inline"
  purchaseLink={{
    label: 'Buy Reprint',
    link: 'https://www.startribune.com/photos',
  }}
  currentIndex={1}
  totalItems={5}
/>
        `,
      },
    },
  },
};

// identifier: all variants
export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: `
<>
  {/* Inline */}
  <Caption
    caption="A scenic view of mountains during sunrise, highlighting nature's beauty."
    credit="Star Tribune staff/The Minnesota Star Tribune"
    variant="inline"
  />

  {/* Inline with CTA */}
  <Caption
    caption="A scenic view of mountains during sunrise, highlighting nature's beauty."
    credit="Star Tribune staff/The Minnesota Star Tribune"
    variant="inline"
    purchaseLink={{
      label: 'Buy Reprint',
      link: 'https://www.startribune.com/photos',
    }}
  />

  {/* Gallery Layout */}
  <Caption
    caption="A scenic view of mountains during sunrise, highlighting nature's beauty."
    credit="Star Tribune staff/The Minnesota Star Tribune"
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

  {/* Lightbox */}
  <Caption
    caption="A scenic view of mountains during sunrise, highlighting nature's beauty."
    credit="Star Tribune staff/The Minnesota Star Tribune"
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

  {/* Lightbox Without CTA */}
  <Caption
    caption="A scenic view of mountains during sunrise, highlighting nature's beauty."
    credit="Star Tribune staff/The Minnesota Star Tribune"
    variant="lightbox"
    currentIndex={1}
    totalItems={17}
    onPrevious={() => {}}
    onNext={() => {}}
  />

  {/* Without Credit */}
  <Caption
    caption="A scenic view of mountains during sunrise, highlighting nature's beauty."
    variant="inline"
  />

  {/* Without Caption */}
  <Caption
    credit="Star Tribune staff/The Minnesota Star Tribune"
    variant="inline"
  />

  {/* Caption only */}
  <Caption
    caption="A scenic view of mountains during sunrise."
  />
</>
        `,
      },
    },
  },

  render: (args) => (
    <div
      style={{
        display: 'grid',
        gap: '40px',
      }}
    >
      {/* Inline */}
      <div>
        <h3 style={{ marginBottom: 8 }}>Inline</h3>

        <Caption {...args} variant="inline" />
      </div>

      {/* Inline with CTA */}
      <div>
        <h3 style={{ marginBottom: 8 }}>Inline With Buy Reprint</h3>

        <Caption
          {...args}
          variant="inline"
          purchaseLink={{
            label: 'Buy Reprint',
            link: 'https://www.startribune.com/photos',
          }}
        />
      </div>

      {/* Gallery Layout */}
      <div>
        <h3 style={{ marginBottom: 8 }}>Gallery Caption</h3>

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
      </div>

      {/* Lightbox */}
      <div
        style={{
          background: '#111',
          padding: '24px',
          borderRadius: '12px',
        }}
      >
        <h3
          style={{
            marginBottom: 8,
            color: '#fff',
          }}
        >
          Lightbox
        </h3>

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
      </div>

      {/* Lightbox Without CTA */}
      <div
        style={{
          background: '#111',
          padding: '24px',
          borderRadius: '12px',
        }}
      >
        <h3
          style={{
            marginBottom: 8,
            color: '#fff',
          }}
        >
          Lightbox Without Buy Reprint
        </h3>

        <Caption
          {...args}
          variant="lightbox"
          currentIndex={1}
          totalItems={17}
          onPrevious={() => {}}
          onNext={() => {}}
        />
      </div>

      {/* Without Credit */}
      <div>
        <h3 style={{ marginBottom: 8 }}>Without Credit</h3>

        <Caption {...args} credit={undefined} />
      </div>

      {/* Without Caption */}
      <div>
        <h3 style={{ marginBottom: 8 }}>Without Caption</h3>

        <Caption {...args} caption={undefined} />
      </div>

      {/* Caption only */}
      <div>
        <h3 style={{ marginBottom: 8 }}>Caption Only</h3>

        <Caption caption="A scenic view of mountains during sunrise." />
      </div>
    </div>
  ),

  args: storyArgs(),
};
