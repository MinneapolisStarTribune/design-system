import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormControl } from './FormControl';
import { IconName } from '../Icon/iconNames';
import { allModes } from '@storybook-config/modes';

// Custom args interface for TextInput storybook story example
interface TextInputStoryArgs {
  placeholderText: string;
  size: 'small' | 'medium' | 'large';
  showIcon: boolean;
  iconName: IconName;
  iconPosition: 'start' | 'end';
  rounded: boolean;
  isDisabled: boolean;
}

const meta = {
  title: 'Components/Actions & Inputs/FormControl',
  component: FormControl,
  parameters: {
    chromatic: { modes: allModes },
    docs: {
      description: {
        component:
          'Text inputs allow users to enter short, single-line text such as names, email addresses, or search queries. They support multiple sizes, optional labels and descriptions, validation states, and icon affordances to accommodate a wide range of use cases across the product.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholderText: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the input',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show icon in input',
    },
    iconName: {
      control: 'select',
      options: ['search', 'mail', 'user', 'lock', 'calendar', 'phone', 'location'] as IconName[],
      description: 'Icon to display',
      if: { arg: 'showIcon' },
    },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Icon position',
      if: { arg: 'showIcon' },
    },
    rounded: {
      control: 'boolean',
      description: 'Rounded input corners',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the form control is disabled',
    },
  } as any,
} satisfies Meta<typeof FormControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    placeholderText: 'Enter text',
    size: 'medium',
    showIcon: false,
    iconName: 'search',
    iconPosition: 'end',
    rounded: false,
    isDisabled: false,
  } as any,
  render: (args) => {
    const storyArgs = args as unknown as TextInputStoryArgs;
    return (
      <FormControl.TextInput
        placeholderText={storyArgs.placeholderText}
        size={storyArgs.size}
        icon={storyArgs.showIcon ? storyArgs.iconName : undefined}
        iconPosition={storyArgs.iconPosition}
        rounded={storyArgs.rounded}
        isDisabled={storyArgs.isDisabled}
      />
    );
  },
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const variants = [
      { label: 'Small', size: 'small' as const },
      { label: 'Medium', size: 'medium' as const },
      { label: 'Large', size: 'large' as const },
      { label: 'With icon (start)', icon: 'search' as const, iconPosition: 'start' as const },
      { label: 'With icon (end)', icon: 'mail' as const, iconPosition: 'end' as const },
      { label: 'Rounded', rounded: true },
      { label: 'Disabled', isDisabled: true },
    ];
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {variants.map((v) => (
          <div key={v.label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{v.label}</span>
            <FormControl.TextInput
              placeholderText={v.label}
              size={v.size ?? 'medium'}
              icon={v.icon}
              iconPosition={v.iconPosition}
              rounded={v.rounded}
              isDisabled={v.isDisabled}
            />
          </div>
        ))}
      </div>
    );
  },
};
