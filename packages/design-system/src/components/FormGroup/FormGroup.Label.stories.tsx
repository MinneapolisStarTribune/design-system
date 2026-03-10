import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormGroup } from './FormGroup';
import { FormControl } from '../FormControl/FormControl';
const meta = {
  title: 'Components/Actions & Inputs/FormGroup/Label',
  component: FormGroup.Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Label text',
    },
    id: {
      control: 'text',
      description:
        'ID for the label element (falls back to FormGroup context labelId when inside FormGroup)',
    },
    htmlFor: {
      control: 'text',
      description:
        'Associates the label with a form control by id (falls back to FormGroup context inputId when inside FormGroup)',
    },
    optional: {
      control: 'boolean',
      description: 'When true, appends " (Optional)" to the label',
    },
  },
} satisfies Meta<typeof FormGroup.Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    children: 'Email address',
    optional: false,
  },
  render: (args) => (
    <FormGroup>
      <FormGroup.Label {...args} />
      <FormControl.TextInput placeholderText="you@example.com" />
    </FormGroup>
  ),
};

export const AllVariants: Story = {
  args: {
    children: 'Email address',
    optional: false,
  },
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Examples of label usage including required, optional, and standalone labels displayed together for comparison.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}
    >
      <FormGroup>
        <FormGroup.Label>Email address</FormGroup.Label>
        <FormControl.TextInput placeholderText="you@example.com" />
      </FormGroup>

      <FormGroup>
        <FormGroup.Label optional>Phone number</FormGroup.Label>
        <FormControl.TextInput placeholderText="Optional field" />
      </FormGroup>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <FormGroup.Label htmlFor="standalone-input">
          Standalone label (with htmlFor)
        </FormGroup.Label>
        <input id="standalone-input" type="text" placeholder="Associated input" />
      </div>
    </div>
  ),
};
