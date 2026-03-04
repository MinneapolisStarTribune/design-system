import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormGroup } from './FormGroup';
import { FormControl } from '../FormControl/FormControl';

const captionVariants = ['info', 'error', 'success'] as const;

const meta = {
  title: 'Components/Actions & Inputs/FormGroup/Caption',
  component: FormGroup.Caption,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: captionVariants,
      description: 'Caption variant',
    },
    children: {
      control: 'text',
      description: 'Caption text',
    },
  },
} satisfies Meta<typeof FormGroup.Caption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    variant: 'info',
    children: 'We recommend using a strong, unique password.',
  },
  render: (args) => (
    <FormGroup>
      <FormGroup.Label>Email Address</FormGroup.Label>
      <FormControl.TextInput placeholderText="Enter your email" />
      <FormGroup.Caption {...args} />
    </FormGroup>
  ),
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'All caption variants (info, error, success) displayed together for comparison within their form groups.',
      },
    },
  },
  args: {
    variant: 'info',
    children: 'We recommend using a strong, unique password.',
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem',
      }}
    >
      {captionVariants.map((variant) => (
        <FormGroup key={variant}>
          <FormGroup.Label>Email Address</FormGroup.Label>
          <FormControl.TextInput placeholderText="Enter your email" />
          <FormGroup.Caption variant={variant}>
            {variant === 'info' && 'We recommend using a strong, unique password.'}
            {variant === 'error' && 'Please enter a valid email address.'}
            {variant === 'success' && 'Email format looks good.'}
          </FormGroup.Caption>
        </FormGroup>
      ))}
    </div>
  ),
};
