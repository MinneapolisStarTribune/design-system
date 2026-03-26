import type { Meta, StoryObj } from '@storybook/react-vite';
import type { PropsWithChildren, ReactNode } from 'react';
import { useState } from 'react';
import { Form } from '@/components/Form';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import { MailIcon } from '@/icons';
import type { CandyBarProps } from './CandyBar';
import { CandyBar } from './CandyBar';
import { CandyBarRenderer, type CandyBarRendererItem } from './CandyBarRenderer/CandyBarRenderer';
import storyStyles from './CandyBar.stories.module.scss';

/** Story args: `children` optional in table (built from **Content preset** in **Configurable**). */
type CandyBarStoryArgs = Omit<CandyBarProps, 'children'> & {
  contentPreset: 'newsletter' | 'simple';
  simpleMessage: string;
  children?: ReactNode;
};

const meta = {
  title: 'Feedback & Status/CandyBar',
  component: CandyBar,
  parameters: {
    layout: 'fullscreen',
    theme: 'dark' as const,
    docs: {
      description: {
        component:
          'Full-width bottom notice: inner chrome around `children` plus dismiss. Portal shell and focus live on `CandyBarRenderer`. Docs: `CandyBar.mdx`.',
      },
    },
  },
  argTypes: {
    children: {
      control: false,
      table: { disable: true },
    },
    contentPreset: {
      control: 'select',
      options: ['newsletter', 'simple'],
      description:
        'Story helper: newsletter mock (icon + copy + form) or a single line of text (**Simple message**).',
      table: { type: { summary: "'newsletter' | 'simple'" } },
    },
    simpleMessage: {
      control: 'text',
      description: 'Shown when **Content preset** is `simple`.',
      if: { arg: 'contentPreset', eq: 'simple' },
      table: { type: { summary: 'string' } },
    },
    className: {
      control: 'text',
      description: 'Optional class on the root bar element.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: 'object',
      description: 'Optional inline styles on the root bar element.',
      table: { type: { summary: 'React.CSSProperties' } },
    },
    onClose: {
      action: 'onClose',
      description: 'Called when the user activates the dismiss control.',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: '—' },
      },
    },
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
        <div style={{ flexShrink: 0, width: '100%', minHeight: 0 }}>
          <Story />
        </div>
      </div>
    ),
  ],
} as Meta<CandyBarStoryArgs>;

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

function CandyBarWithClose(props: CandyBarProps) {
  const [open, setOpen] = useState(true);
  const { onClose: _onClose, ...candyBarProps } = props;
  return (
    <>
      {open ? (
        <CandyBar {...candyBarProps} onClose={() => setOpen(false)} />
      ) : (
        <button
          type="button"
          className={storyStyles.showCandyBarAgain}
          onClick={() => setOpen(true)}
        >
          Show candy bar again
        </button>
      )}
    </>
  );
}

export const Configurable: Story = {
  args: {
    contentPreset: 'newsletter',
    simpleMessage: 'Short notice text.',
    onClose: () => {},
  },
  render: function ConfigurableCandyBar(args) {
    const { contentPreset, simpleMessage, ...candyBarProps } = args;
    const children =
      contentPreset === 'newsletter' ? (
        <NewsletterSample headlineClassName="typography-utility-page-h4" />
      ) : (
        <span className="typography-utility-text-regular-small">{simpleMessage}</span>
      );
    return <CandyBarWithClose {...candyBarProps}>{children}</CandyBarWithClose>;
  },
};

// Story-level state adapter for CandyBarRenderer behavior in docs.
function CandyBarRendererStory({ children }: PropsWithChildren) {
  const [active, setActive] = useState<CandyBarRendererItem | null>({
    id: 'story',
    children,
  });

  if (!active) {
    return (
      <button
        type="button"
        className={storyStyles.showCandyBarAgain}
        onClick={() => setActive({ id: 'story', children })}
      >
        Show candy bar again
      </button>
    );
  }

  return <CandyBarRenderer activeItem={active} onDismiss={() => setActive(null)} />;
}

export const WithRenderer: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Uses **`CandyBarRenderer`** (`activeItem` + `onDismiss`) like production: portal to the bottom of the viewport, transitions, focus trap, Escape to dismiss. Inner content is the newsletter sample.',
      },
    },
  },
  args: {
    contentPreset: 'newsletter',
    simpleMessage: '',
    children: <NewsletterSample headlineClassName="typography-utility-page-h4" />,
    onClose: () => {},
  },
  render: (args) => <CandyBarRendererStory>{args.children}</CandyBarRendererStory>,
};
