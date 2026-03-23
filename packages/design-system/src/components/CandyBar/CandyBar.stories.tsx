import type { Meta, StoryObj } from '@storybook/react-vite';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { Form } from '@/components/Form';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import { MailIcon } from '@/icons';
import { CandyBar } from './CandyBar';
import { CandyBarRenderer, type CandyBarRendererItem } from './CandyBarRenderer/CandyBarRenderer';
import storyStyles from './CandyBar.stories.module.scss';

const meta = {
  title: 'Feedback & Status/CandyBar',
  component: CandyBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    theme: 'dark' as const,
    docs: {
      description: {
        story:
          '**Default** uses `CandyBarRenderer` (`activeItem` + `onDismiss`) like production (portal, transitions, focus). `CandyBar` is the inner chrome around `children`.',
      },
    },
  },
  argTypes: {
    children: { control: false },
    onClose: { action: 'onClose' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-base-white, #fff)',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 0,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <UtilityLabel
            size="large"
            weight="semibold"
            style={{ color: 'var(--color-base-black, #000000)' }}
          >
            Web Page Content
          </UtilityLabel>
        </div>
        {/* Mount point for CandyBarRenderer (bar itself portals to `document.body`, fixed bottom). */}
        <div style={{ flexShrink: 0, width: '100%', minHeight: 0 }}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof CandyBar>;

export default meta;

type Story = StoryObj<typeof meta>;

function NewsletterSample({ headlineClassName }: { headlineClassName: string }) {
  return (
    <div className={storyStyles.newsletterGrid}>
      <div className={storyStyles.newsletterColIcon} aria-hidden>
        <MailIcon color="on-dark-primary" />
      </div>
      <div className={storyStyles.newsletterColCopyHeadline}>
        <span className={`${headlineClassName} ${storyStyles.newsletterHeadline}`}>
          {'<NEWSLETTER>-SELECTED'}
        </span>
      </div>
      <div className={storyStyles.newsletterColCopyBody}>
        <span className={`typography-utility-text-regular-small ${storyStyles.newsletterBodyText}`}>
          Enter your email address and click Submit to start receiving newsletters.
        </span>
      </div>
      <div className={storyStyles.newsletterColForm}>
        <Form
          className={storyStyles.newsletterForm}
          orientation="horizontal"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <FormGroup>
            <FormGroup.Label>Enter email address</FormGroup.Label>
            <FormControl.TextInput
              className={storyStyles.newsletterEmailInput}
              name="email"
              type="email"
              autoComplete="email"
              placeholderText="someone@example.com"
              rounded
              size="medium"
            />
          </FormGroup>
          <Form.Button color="neutral" variant="filled" size="medium">
            Submit
          </Form.Button>
        </Form>
      </div>
    </div>
  );
}

// TODO: Swap for SnackProvider when it exists (keep `activeItem` + `onDismiss` → `CandyBarRenderer`).
function CandyBarRendererStory({ children }: PropsWithChildren) {
  const [active, setActive] = useState<CandyBarRendererItem | null>({
    id: 'story',
    children,
  });

  if (!active) {
    return <div style={{ flexShrink: 0, width: '100%', minHeight: 0 }} />;
  }

  return <CandyBarRenderer activeItem={active} onDismiss={() => setActive(null)} />;
}

export const Default: Story = {
  args: {
    children: <NewsletterSample headlineClassName="typography-utility-page-h4" />,
    onClose: () => {},
  },
  render: (args) => <CandyBarRendererStory>{args.children}</CandyBarRendererStory>,
} satisfies Story;
