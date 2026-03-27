import type { Meta, StoryObj } from '@storybook/react-vite';

import { SwiperCarousel } from './SwiperCarousel';
import { FormGroup, SectionHeading, SwiperCarouselProps, UtilityBody } from '@/index.web';
import { NavigationProps } from './SwiperCarousel.types';

const meta: Meta<typeof SwiperCarousel> = {
  title: 'Components/SwiperCarousel',
  component: SwiperCarousel,

  parameters: {
    layout: 'padded',
  },

  args: {
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: false,
    centeredSlides: false,
  },

  argTypes: {
    slidesPerView: {
      control: { type: 'radio' },
      options: ['auto', 1, 2, 3],
    },
    spaceBetween: {
      control: { type: 'number' },
    },
    loop: { control: 'boolean' },
    centeredSlides: { control: 'boolean' },
    breakpoints: { control: false },
    className: { control: false },
    children: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof SwiperCarousel>;

const DemoCard = ({ index }: { index: number }) => (
  <div
    style={{
      width: 240,
      height: 140,
      border: '1px solid #e5e5e5',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      fontWeight: 600,
    }}
  >
    Card {index}
  </div>
);

const items = Array.from({ length: 6 }, (_, i) => i + 1);

/**
 * Default carousel with pagination
 */
export const Default: Story = {
  render: (args) => (
    <SwiperCarousel {...args}>
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <DemoCard index={i} />
        </SwiperCarousel.Slide>
      ))}

      <SwiperCarousel.Pagination />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <FormGroup>
          <FormGroup.Caption variant="info">Captions (Formgroup.caption Used)</FormGroup.Caption>
        </FormGroup>
        <SwiperCarousel.Navigation />
      </div>
    </SwiperCarousel>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<SwiperCarousel slidesPerView="auto" spaceBetween={16}>
  {items.map((i) => (
    <SwiperCarousel.Slide key={i}>
      <DemoCard index={i} />
    </SwiperCarousel.Slide>
  ))}

  <SwiperCarousel.Pagination />

  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <FormGroup>
          <FormGroup.Caption variant="info">Captions (Formgroup.caption Used)</FormGroup.Caption>
        </FormGroup>
    <SwiperCarousel.Navigation />
  </div>
</SwiperCarousel>
        `,
      },
    },
  },
};

/**
 * Custom pagination centered with navigation
 */
export const CustomPagination: Story = {
  args: { loop: true },
  render: (args) => (
    <SwiperCarousel {...args}>
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <DemoCard index={i} />
        </SwiperCarousel.Slide>
      ))}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <SwiperCarousel.Pagination variant="custom" />
        </div>
        <SwiperCarousel.Navigation />
      </div>
    </SwiperCarousel>
  ),
};

/**
 * No pagination with navigation
 */
export const NoPagination: Story = {
  render: (args) => (
    <SwiperCarousel {...args}>
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <DemoCard index={i} />
        </SwiperCarousel.Slide>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <UtilityBody size="x-small">Image caption (Utility body (x-small))</UtilityBody>
        <SwiperCarousel.Navigation />
      </div>
    </SwiperCarousel>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<SwiperCarousel slidesPerView="auto" spaceBetween={16}>
  {items.map((i) => (
    <SwiperCarousel.Slide key={i}>
      <DemoCard index={i} />
    </SwiperCarousel.Slide>
  ))}

  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <UtilityBody size="x-small">Image caption (Utility body (x-small))</UtilityBody>
    <SwiperCarousel.Navigation />
  </div>
</SwiperCarousel>
        `,
      },
    },
  },
};

/**
 * Image gallery (single slide view)
 */
export const ImageGalleryStandard: Story = {
  args: {
    slidesPerView: 1,
    spaceBetween: 0,
  },
  render: (args) => (
    <SwiperCarousel {...args}>
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <div
            style={{
              width: '100%',
              height: 300,
              background: '#ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            Image {i}
          </div>
        </SwiperCarousel.Slide>
      ))}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <UtilityBody size="small">Image caption (Utility body)</UtilityBody>
        <SwiperCarousel.Navigation />
      </div>
    </SwiperCarousel>
  ),
  parameters: {
    docs: {
      source: {
        code: ` <SwiperCarousel {...args}>
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <div
            style={{
              width: '100%',
              height: 300,
              background: '#ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
            }}
          >
            Image {i}
          </div>
        </SwiperCarousel.Slide>
      ))}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <UtilityBody size='small'>Image caption (Utility body)</UtilityBody>
        <SwiperCarousel.Navigation />
      </div>
    </SwiperCarousel>`,
      },
    },
  },
};

/**
 * Top controls layout
 */
export const Layout_TopControls: Story = {
  render: (args) => (
    <SwiperCarousel {...args}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <SectionHeading importance={3}>The Latest</SectionHeading>
        <SwiperCarousel.Navigation />
      </div>

      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <DemoCard index={i} />
        </SwiperCarousel.Slide>
      ))}
    </SwiperCarousel>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<SwiperCarousel slidesPerView="auto" spaceBetween={16}>
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <SectionHeading importance={1}>The Latest</SectionHeading>
    <SwiperCarousel.Navigation />
  </div>

  {items.map((i) => (
    <SwiperCarousel.Slide key={i}>
      <DemoCard index={i} />
    </SwiperCarousel.Slide>
  ))}
</SwiperCarousel>
        `,
      },
    },
  },
};

type NavigationStoryArgs = SwiperCarouselProps & NavigationProps;

export const NavigationControls: StoryObj<NavigationStoryArgs> = {
  args: {
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: false,
    centeredSlides: false,
    size: 'large',
  },

  render: ({ size, buttonProps, prevButtonProps, nextButtonProps, ...args }) => (
    <SwiperCarousel {...args}>
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <DemoCard index={i} />
        </SwiperCarousel.Slide>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <UtilityBody size="medium">Image caption (Utility body (medium))</UtilityBody>

        <SwiperCarousel.Navigation
          size={size}
          buttonProps={buttonProps}
          prevButtonProps={prevButtonProps}
          nextButtonProps={nextButtonProps}
        />
      </div>
    </SwiperCarousel>
  ),

  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
    buttonProps: {
      control: 'object',
    },
    prevButtonProps: {
      control: 'object',
    },
    nextButtonProps: {
      control: 'object',
    },
  },

  parameters: {
    docs: {
      source: {
        code: `
<SwiperCarousel slidesPerView="auto" spaceBetween={16}>
  {items.map((i) => (
    <SwiperCarousel.Slide key={i}>
      <DemoCard index={i} />
    </SwiperCarousel.Slide>
  ))}

  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <UtilityBody size="medium">Image caption (Utility body (medium))</UtilityBody>
    <SwiperCarousel.Navigation
      size="large"
      buttonProps={{ variant: 'ghost' }}
      prevButtonProps={{ 'aria-label': 'Previous slide' }}
      nextButtonProps={{ 'aria-label': 'Next slide' }}
    />
  </div>
</SwiperCarousel>
        `,
      },
    },
  },
};
