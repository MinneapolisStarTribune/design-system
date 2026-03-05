import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormControl } from '../FormControl';
import { IconName } from '@/components/Icon/iconNames';

const meta = {
  title: 'Components/Actions & Inputs/TextInput',
  component: FormControl.TextInput,
  parameters: {
    docs: {
      description: {
        component:
          'Single-line text input for names, emails, search, etc. Supports sizes, icons, validation states (error/success), and works standalone or within FormGroup for full accessibility wiring.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholderText: {
      control: 'text',
      description: 'Placeholder text when empty',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Input size',
    },
    icon: {
      control: 'select',
      options: ['search', 'mail', 'user', 'lock', 'calendar', 'phone', 'location'] as IconName[],
      description: 'Optional icon',
    },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Icon position',
    },
    rounded: {
      control: 'boolean',
      description: 'Rounded corners',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    isError: {
      control: 'boolean',
      description: 'Error state (red border)',
    },
    isSuccess: {
      control: 'boolean',
      description: 'Success state (green border)',
    },
    value: {
      control: 'text',
      description: 'Controlled value (shows filled state when non-empty)',
    },
  },
} satisfies Meta<typeof FormControl.TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholderText: 'Enter text',
    size: 'medium',
    iconPosition: 'end',
    rounded: false,
    isDisabled: false,
    isError: false,
    isSuccess: false,
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
    placeholderText: 'Search',
    icon: 'search',
    iconPosition: 'start',
  },
};

export const AllStates: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.5rem',
      }}
    >
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
          Default
        </label>
        <FormControl.TextInput placeholderText="Placeholder" aria-label="Default input" />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
          Filled
        </label>
        <FormControl.TextInput
          placeholderText="Placeholder"
          value="Some text"
          aria-label="Filled input"
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
          Error
        </label>
        <FormControl.TextInput placeholderText="Placeholder" isError aria-label="Error input" />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
          Success
        </label>
        <FormControl.TextInput placeholderText="Placeholder" isSuccess aria-label="Success input" />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
          Disabled
        </label>
        <FormControl.TextInput
          placeholderText="Placeholder"
          isDisabled
          aria-label="Disabled input"
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
          With icon (start)
        </label>
        <FormControl.TextInput
          placeholderText="Search"
          icon="search"
          iconPosition="start"
          aria-label="Search input"
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>
          Rounded
        </label>
        <FormControl.TextInput placeholderText="Rounded" rounded aria-label="Rounded input" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 300 }}>
      <FormControl.TextInput placeholderText="Small" size="small" aria-label="Small" />
      <FormControl.TextInput placeholderText="Medium" size="medium" aria-label="Medium" />
      <FormControl.TextInput placeholderText="Large" size="large" aria-label="Large" />
    </div>
  ),
};
