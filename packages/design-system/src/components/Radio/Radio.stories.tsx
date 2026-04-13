import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { UtilityLabel } from '@/components/Typography/Utility';
import { Radio } from './Radio';

/**
 * Varsity light `color.radio` brand tokens (`cobalt-blue.700`) so a Varsity-colored
 * `color="brand"` radio is visible side-by-side with Star Tribune when the Storybook
 * Brand toolbar is set to Star Tribune (default loaded theme).
 */
const varsityBrandRadioSurfaceStyle = {
  '--color-radio-border-selected-brand': '#0064cf',
  '--color-radio-dot-selected-brand': '#0064cf',
} as CSSProperties;

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

/** Focuses the native input on mount to demonstrate the focus ring */
function FocusedRadio(props: React.ComponentProps<typeof Radio>) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    containerRef.current?.querySelector<HTMLInputElement>('input')?.focus();
  }, []);
  return (
    <div ref={containerRef}>
      <Radio {...props} />
    </div>
  );
}

const meta = {
  title: 'Forms/FormControl/Radio',
  component: Radio,
  argTypes: {
    title: {
      control: 'text',
      description: 'Required title text',
    },
    description: {
      control: 'text',
      description: 'Optional description text below the title',
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
    },
    color: {
      control: 'select',
      options: ['neutral', 'brand'],
      description: 'Color variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    title: 'Subscribe to newsletter',
    description: "You'll receive weekly updates and announcements.",
    checked: false,
    color: 'brand',
    disabled: false,
    error: false,
    onChange: () => {},
  },
  render: function ConfigurableRender(args) {
    const [checked, setChecked] = useState(args.checked);

    useEffect(() => {
      setChecked(args.checked);
    }, [args.checked]);

    return (
      <Radio {...args} checked={checked} onChange={setChecked} dataTestId="radio-configurable" />
    );
  },
};

export const AllVariants: Story = {
  args: {
    title: 'All variants',
    checked: false,
    onChange: () => {},
  },
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: function AllVariantsRender() {
    const [withDescription, setWithDescription] = useState(false);
    const [neutralInGroup, setNeutralInGroup] = useState(false);
    const [brandInGroup, setBrandInGroup] = useState(true);

    const cellStyle = { minWidth: 0 };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '2rem 1.5rem',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={cellStyle}>
          <SectionLabel>Neutral / Unchecked</SectionLabel>
          <Radio
            title="Receive product updates"
            description="We send one message each week."
            checked={false}
            color="neutral"
            onChange={() => {}}
            dataTestId="all-neutral-unchecked"
          />
        </div>

        <div style={cellStyle}>
          <SectionLabel>Neutral / Checked</SectionLabel>
          <Radio
            title="Receive product updates"
            description="We send one message each week."
            checked
            color="neutral"
            onChange={() => {}}
            dataTestId="all-neutral-checked"
          />
        </div>

        <div style={cellStyle}>
          <SectionLabel>Brand / checked</SectionLabel>
          <Radio
            title="Receive product updates"
            description="We send one message each week."
            checked
            color="brand"
            onChange={() => {}}
            dataTestId="all-brand-checked"
          />
        </div>

        <div style={cellStyle}>
          <SectionLabel>Brand / checked (Varsity)</SectionLabel>
          <div style={varsityBrandRadioSurfaceStyle}>
            <Radio
              title="Receive product updates"
              description="We send one message each week."
              checked
              color="brand"
              onChange={() => {}}
              dataTestId="all-brand-checked-varsity"
            />
          </div>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Neutral + Brand (group)</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Radio
              title="Neutral (default)"
              description="Used for most forms."
              checked={neutralInGroup}
              color="neutral"
              onChange={() => {
                setNeutralInGroup(true);
                setBrandInGroup(false);
              }}
              dataTestId="all-group-neutral"
            />
            <Radio
              title="Brand"
              description="Use when brand emphasis is required."
              checked={brandInGroup}
              color="brand"
              onChange={() => {
                setBrandInGroup(true);
                setNeutralInGroup(false);
              }}
              dataTestId="all-group-brand"
            />
          </div>
        </div>

        <div style={cellStyle}>
          <SectionLabel>With description (interactive)</SectionLabel>
          <Radio
            title="Subscribe to newsletter"
            description="Daily updates; unsubscribe anytime."
            checked={withDescription}
            onChange={setWithDescription}
            color="neutral"
            dataTestId="all-with-description"
          />
        </div>

        <div style={cellStyle}>
          <SectionLabel>Error</SectionLabel>
          <Radio
            title="Required choice"
            description="You must select one option."
            checked={false}
            error
            onChange={() => {}}
            dataTestId="all-error"
          />
        </div>

        <div style={cellStyle}>
          <SectionLabel>Focused / Unchecked</SectionLabel>
          <FocusedRadio
            title="Receive product updates"
            description="We send one message each week."
            checked={false}
            color="neutral"
            onChange={() => {}}
            dataTestId="all-focused-unchecked"
          />
        </div>

        <div style={cellStyle}>
          <SectionLabel>Disabled / Unchecked</SectionLabel>
          <Radio
            title="Disabled option"
            description="This choice is not available."
            checked={false}
            disabled
            onChange={() => {}}
            dataTestId="all-disabled-unchecked"
          />
        </div>

        <div style={cellStyle}>
          <SectionLabel>Disabled / Checked</SectionLabel>
          <Radio
            title="Disabled option"
            description="Previously selected; cannot change."
            checked
            disabled
            onChange={() => {}}
            dataTestId="all-disabled-checked"
          />
        </div>
      </div>
    );
  },
};
