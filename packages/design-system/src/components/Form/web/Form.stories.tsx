import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from './Form';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { FormControl } from '@/components/FormControl/FormControl';

const meta = {
  title: 'Forms/Form (Optional Layout Wrapper)',
  component: Form,
  excludeStories: ['FormDocSources'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description:
        'Layout: vertical (stacked, button bottom-right) or horizontal (input + button on same row)',
    },
  },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FormDocSources = {
  verticalForm: `
<Form onSubmit={(e) => e.preventDefault()}>
  <FormGroup>
    <FormGroup.Label>Email</FormGroup.Label>
    <FormControl.TextInput placeholderText="Enter your email" />
  </FormGroup>
  <FormGroup>
    <FormGroup.Label>Password</FormGroup.Label>
    <FormControl.TextInput type="password" placeholderText="Enter your password" />
  </FormGroup>
  <Form.Button>Submit</Form.Button>
</Form>
`.trim(),
  horizontalForm: `
<Form orientation="horizontal" onSubmit={(e) => e.preventDefault()}>
  <FormGroup>
    <FormGroup.Label>Email</FormGroup.Label>
    <FormControl.TextInput placeholderText="Enter your email" />
  </FormGroup>
  <Form.Button>Submit</Form.Button>
</Form>
`.trim(),
} as const;

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  } as React.ComponentProps<typeof Form>,
  parameters: {
    docs: {
      source: {
        code: FormDocSources.verticalForm,
        type: 'code',
      },
    },
  },
  render: (args) => (
    <Form {...args} onSubmit={(e) => e.preventDefault()}>
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <FormControl.TextInput placeholderText="Enter your email" />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Password</FormGroup.Label>
        <FormControl.TextInput type="password" placeholderText="Enter your password" />
      </FormGroup>
      <Form.Button>Submit</Form.Button>
    </Form>
  ),
};
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  } as React.ComponentProps<typeof Form>,
  parameters: {
    docs: {
      description: {
        story:
          '**Best for:** search bars, newsletter CTAs, inline filters — anywhere a single action applies to one or a small number of fields.\n\n' +
          '**Avoid for:** multiple unrelated fields, radio groups, or checkbox groups. Use vertical layout instead.',
      },
      source: {
        code: FormDocSources.horizontalForm,
        type: 'code',
      },
    },
  },
  render: (args) => (
    <Form {...args} onSubmit={(e) => e.preventDefault()}>
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <FormControl.TextInput placeholderText="Enter your email" />
      </FormGroup>
      <Form.Button>Submit</Form.Button>
    </Form>
  ),
};
