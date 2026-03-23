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
    /**
     * Dark color scheme loads tokens where neutral filled Button is light-on-dark (white pill).
     * Light scheme uses dark filled neutral — wrong on the CandyBar without overrides.
     */
    theme: 'dark' as const,
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
          maxHeight: '100vh',
          position: 'relative',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          /* Mock “document” surface while story uses dark theme tokens for the bar */
          backgroundColor: 'var(--color-base-white, #ffffff)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'stretch',
            minHeight: 0,
            /* Reserve space for fixed CandyBar (~min-height + padding) so label centers above it */
            paddingBottom: 'clamp(120px, 22vh, 200px)',
            boxSizing: 'border-box',
          }}
        >
          <UtilityLabel size="large" weight="semibold">
            Web Page Content
          </UtilityLabel>
        </div>
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        >
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
