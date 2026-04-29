import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import type { SwitchProps } from './Switch';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const meta = {
  title: 'Forms/FormControl/Switch',
  component: FormControl.Switch,
  parameters: {
    docs: {
      description: {
        component:
          'Switch toggles immediate on/off settings. It supports neutral and brand color modes, three sizes, optional labels/captions, and works standalone or inside FormGroup for accessibility wiring.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['neutral', 'brand'],
      description: 'Switch color style.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Switch size.',
    },
    selected: {
      control: 'boolean',
      description: 'Controlled selected state.',
    },
    label: {
      control: 'text',
      description: 'Optional visible label.',
    },
    labelPosition: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Position of the label relative to the switch.',
    },
    caption: {
      control: 'text',
      description: 'Optional supporting caption.',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled styling.',
    },
  },
} satisfies Meta<typeof FormControl.Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    color: 'neutral',
    size: 'medium',
    selected: true,
    label: 'Enable notifications',
    caption: 'Changes apply immediately.',
    isDisabled: false,
    labelPosition: 'start',
  },
  render: function ConfigurableRender(args) {
    const [selected, setSelected] = useState(args.selected);
    useEffect(() => {
      setSelected(args.selected);
    }, [args.selected]);

    return (
      <FormControl.Switch
        {...args}
        selected={selected}
        onChange={(next: boolean) => {
          setSelected(next);
          args.onChange?.(next);
        }}
      />
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: function AllVariantsRender() {
    const [states, setStates] = useState<Record<string, boolean>>({
      smallNeutral: false,
      mediumNeutral: true,
      largeNeutral: false,
      smallBrand: false,
      mediumBrand: true,
      largeBrand: true,
      grouped: true,
      standalone: false,
    });

    const toggle = (key: string) => setStates((prev) => ({ ...prev, [key]: !prev[key] }));
    const cellStyle = { minWidth: 0 };

    const demoConfig: Array<{
      key: keyof typeof states;
      title: string;
      color: SwitchProps['color'];
      size: SwitchProps['size'];
      labelPosition?: SwitchProps['labelPosition'];
      caption?: string;
      isDisabled?: boolean;
    }> = [
      {
        key: 'smallNeutral',
        title: 'Small / Neutral',
        color: 'neutral',
        size: 'small',
      },
      {
        key: 'mediumNeutral',
        title: 'Medium / Neutral (Default)',
        color: 'neutral',
        size: 'medium',
      },
      {
        key: 'largeNeutral',
        title: 'Large / Neutral',
        color: 'neutral',
        size: 'large',
        caption: 'Use large sparingly for high-visibility settings.',
      },
      {
        key: 'smallBrand',
        title: 'Small / Brand',
        color: 'brand',
        size: 'small',
      },
      {
        key: 'mediumBrand',
        title: 'Medium / Brand',
        color: 'brand',
        size: 'medium',
      },
      {
        key: 'largeBrand',
        title: 'Large / Brand',
        color: 'brand',
        size: 'large',
      },
    ];

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem 1.5rem',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {demoConfig.map((item) => (
          <div key={item.key} style={cellStyle}>
            <SectionLabel>{item.title}</SectionLabel>
            <FormControl.Switch
              label="Enable setting"
              labelPosition={item.labelPosition}
              caption={item.caption}
              color={item.color}
              size={item.size}
              selected={states[item.key]}
              isDisabled={item.isDisabled}
              onChange={() => toggle(item.key)}
            />
          </div>
        ))}

        <div style={cellStyle}>
          <SectionLabel>Disabled</SectionLabel>
          <FormControl.Switch
            label="System maintenance mode"
            caption="Temporarily locked by admin."
            selected={false}
            isDisabled
            onChange={() => {}}
          />
        </div>

        <div style={cellStyle}>
          <SectionLabel>Inside FormGroup</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Personalized homepage</FormGroup.Label>
            <FormGroup.Description>
              Show stories based on your reading behavior.
            </FormGroup.Description>
            <FormControl.Switch
              selected={states.grouped}
              onChange={() => toggle('grouped')}
              aria-label="Toggle personalized homepage"
            />
            <FormGroup.Caption variant="info">Updates your feed instantly.</FormGroup.Caption>
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Standalone (No Visible Label)</SectionLabel>
          <FormControl.Switch
            selected={states.standalone}
            onChange={() => toggle('standalone')}
            aria-label="Toggle autoplay videos"
          />
        </div>
      </div>
    );
  },
};
