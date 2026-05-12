import type { Meta, StoryObj } from '@storybook/react-vite';

import { SwiperCarousel } from './SwiperCarousel';
import { FormGroup, SectionHeading, SwiperCarouselProps, UtilityBody } from '@/index.web';
import type { NavigationProps } from './SwiperCarousel.types';

type StoryArgs = SwiperCarouselProps & NavigationProps;

const meta: Meta<StoryArgs> = {
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
    size: 'medium',
  },

  argTypes: {
    slidesPerView: {
      control: { type: 'radio' },
      options: ['auto', 1, 2, 3],
    },
    spaceBetween: { control: { type: 'number' } },
    loop: { control: 'boolean' },
    centeredSlides: { control: 'boolean' },

    size: {
      control: { type: 'select' },
      options: ['x-small', 'small', 'medium', 'large'],
    },

    breakpoints: { control: false },
    className: { control: false },
    children: { control: false },
  },
};
export default meta;

type Story = StoryObj<StoryArgs>;

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
const smallItems = [1, 2];

const sectionLabelStyle = {
  marginBottom: 12,
  color: 'var(--color-text-on-light-secondary)',
} as const;
const sectionGap = { display: 'flex', flexDirection: 'column' as const, gap: 48 };

/** Interactive playground — tweak Swiper props via Controls. */
export const Configurable: Story = {
  render: (args) => (
    <SwiperCarousel {...args}>
      {items.map((i) => (
        <SwiperCarousel.Slide key={i}>
          <DemoCard index={i} />
        </SwiperCarousel.Slide>
      ))}

      <SwiperCarousel.Pagination />

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        <FormGroup>
          <FormGroup.Caption variant="info">Captions (Formgroup.caption Used)</FormGroup.Caption>
        </FormGroup>
        <SwiperCarousel.Navigation size={args.size} />
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
        <SwiperCarousel.Navigation size={args.size}/>
  </div>
</SwiperCarousel>
        `,
      },
    },
  },
};

type NavigationStoryArgs = SwiperCarouselProps & NavigationProps;

/** Static reference: pagination, no pagination, image gallery, top controls, nav sizing, no-scroll. */
export const AllVariants: StoryObj<NavigationStoryArgs> = {
  name: 'All variants',
  parameters: {
    controls: { disable: true },
    layout: 'padded',
    docs: {
      description: {
        story:
          'Layout patterns previously split across separate stories: pagination + caption, UtilityBody caption, single-slide gallery, heading + nav, customizable navigation size, and auto-hidden controls when there are not enough slides.',
      },
    },
  },
  args: {
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: false,
    centeredSlides: false,
    size: 'large',
  },
  render: ({ size, buttonProps, prevButtonProps, nextButtonProps, ...args }) => (
    <div style={sectionGap}>
      <section>
        <p className="typography-utility-text-regular-small" style={sectionLabelStyle}>
          With pagination + FormGroup caption
        </p>
        <SwiperCarousel {...args}>
          {items.map((i) => (
            <SwiperCarousel.Slide key={i}>
              <DemoCard index={i} />
            </SwiperCarousel.Slide>
          ))}
          <SwiperCarousel.Pagination />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormGroup>
              <FormGroup.Caption variant="info">
                Captions (Formgroup.caption Used)
              </FormGroup.Caption>
            </FormGroup>
            <SwiperCarousel.Navigation
              size={size}
              prevButtonProps={{
                onClick: () => alert('Prev tracking'),
              }}
              nextButtonProps={{
                onClick: () => alert('Next tracking'),
              }}
            />
          </div>
        </SwiperCarousel>
      </section>

      <section>
        <p className="typography-utility-text-regular-small" style={sectionLabelStyle}>
          No pagination — UtilityBody caption (x-small)
        </p>
        <SwiperCarousel {...args}>
          {items.map((i) => (
            <SwiperCarousel.Slide key={`np-${i}`}>
              <DemoCard index={i} />
            </SwiperCarousel.Slide>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <UtilityBody size="x-small">Image caption (Utility body (x-small))</UtilityBody>
            <SwiperCarousel.Navigation />
          </div>
        </SwiperCarousel>
      </section>

      <section>
        <p className="typography-utility-text-regular-small" style={sectionLabelStyle}>
          Image gallery (slidesPerView: 1)
        </p>
        <SwiperCarousel {...args} slidesPerView={1} spaceBetween={0}>
          {items.map((i) => (
            <SwiperCarousel.Slide key={`ig-${i}`}>
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
      </section>

      <section>
        <p className="typography-utility-text-regular-small" style={sectionLabelStyle}>
          Top controls — SectionHeading + Navigation
        </p>
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
            <SwiperCarousel.Slide key={`tc-${i}`}>
              <DemoCard index={i} />
            </SwiperCarousel.Slide>
          ))}
        </SwiperCarousel>
      </section>

      <section>
        <p className="typography-utility-text-regular-small" style={sectionLabelStyle}>
          Navigation — size + optional button props (medium caption)
        </p>
        <SwiperCarousel {...args}>
          {items.map((i) => (
            <SwiperCarousel.Slide key={`nav-${i}`}>
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
      </section>

      <section>
        <p className="typography-utility-text-regular-small" style={sectionLabelStyle}>
          Not enough slides — pagination and navigation auto-hide
        </p>
        <SwiperCarousel {...args}>
          {smallItems.map((i) => (
            <SwiperCarousel.Slide key={`ns-${i}`}>
              <DemoCard index={i} />
            </SwiperCarousel.Slide>
          ))}
          <SwiperCarousel.Pagination />
          <SwiperCarousel.Navigation />
        </SwiperCarousel>
      </section>
    </div>
  ),
};
