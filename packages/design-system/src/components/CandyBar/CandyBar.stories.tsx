import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from '@/components/Form';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import { MailIcon } from '@/icons';
import { CandyBar } from './CandyBar';
import storyStyles from './CandyBar.stories.module.scss';

const meta = {
  title: 'Feedback & Status/CandyBar',
  component: CandyBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    theme: 'dark' as const,
    /** Docs tab: compact preview height. */
    docs: {
      story: {
        height: 'min(320px, 42vh)',
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
          /* Column flex: bar last row. */
          minHeight: 'min(420px, 72vh)',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-base-white, #ffffff)',
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
        <div style={{ flexShrink: 0, width: '100%' }}>
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

export const Default: Story = {
  args: {
    children: <NewsletterSample headlineClassName="typography-utility-page-h4" />,
    onClose: () => {},
  },
} satisfies Story;
