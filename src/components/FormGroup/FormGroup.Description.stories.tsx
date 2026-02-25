import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormGroupDescription } from './FormGroup.Description';

const meta = {
  title: 'Components/Actions & Inputs/FormGroup/Description',
  component: FormGroupDescription,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content of the description text.',
    },
    id: {
      control: 'text',
      description: 'Optional id attribute for the description element.',
    },
    dataTestId: {
      control: 'text',
      description: 'Test id used for querying the element in tests.',
    },
  },
} satisfies Meta<typeof FormGroupDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "We'll never share your email.",
  },
};

export const WithCustomIdAndTestId: Story = {
  args: {
    id: 'email-description',
    dataTestId: 'form-group-description',
    children: 'Description with custom id and data-testid.',
  },
};

export const LongText: Story = {
  args: {
    children:
      'This description provides additional context about the form field, explaining what information is required and how it will be used. It can span multiple sentences and should remain readable at smaller sizes.',
  },
};

