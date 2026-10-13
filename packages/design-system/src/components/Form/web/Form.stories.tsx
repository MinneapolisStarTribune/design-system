import type { Meta, StoryObj } from '@storybook/react-vite';
import { formDefaults, TextField } from '@minneapolisstartribune/design-system-tanstack-form';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Form } from './Form';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { FormControl } from '@/components/FormControl/FormControl';

const meta = {
  title: 'Forms/Form (Optional Layout & Logic Wrapper)',
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
  withValidationSimple: `
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { formDefaults, TextField } from '@minneapolisstartribune/design-system-tanstack-form';
import { Form } from '@minneapolisstartribune/design-system/web';

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required').pipe(z.email('Please enter a valid email address')),
});

function SimpleValidationExample() {
  const form = useForm({
    ...formDefaults,
    defaultValues: { email: '' },
    validators: [{ run: schema, triggers: ['change', 'blur'] }],
    onSubmit: ({ value }) => alert(\`Submitted: \${value.email}\`),
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => <TextField field={field} label="Email" placeholderText="you@example.com" />}
      </form.Field>
      <Form.Button>Submit</Form.Button>
    </Form>
  );
}
`.trim(),
  withValidationMultiField: `
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { formDefaults, TextField } from '@minneapolisstartribune/design-system-tanstack-form';
import { Form } from '@minneapolisstartribune/design-system/web';

const schema = z.object({
  name: z.string(),
  email: z.string().trim().min(1, 'Email is required').pipe(z.email('Please enter a valid email address')),
  message: z.string().trim().min(1, 'Message is required'),
});

function MultiFieldValidationExample() {
  const form = useForm({
    ...formDefaults,
    defaultValues: { name: 'Jane Doe', email: '', message: '' },
    validators: [{ run: schema, triggers: ['change', 'blur'] }],
    onSubmit: ({ value }) => alert(\`Submitted: \${value.name}, \${value.email}, \${value.message}\`),
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="name">
        {(field) => <TextField field={field} label="Name" optional placeholderText="Your name" />}
      </form.Field>
      <form.Field name="email">
        {(field) => (
          <TextField
            field={field}
            label="Email"
            description="Where should we email updates?"
            placeholderText="you@example.com"
          />
        )}
      </form.Field>
      <form.Field name="message">
        {(field) => <TextField field={field} label="Message" placeholderText="Your message" />}
      </form.Field>
      <Form.Button>Submit</Form.Button>
    </Form>
  );
}
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

type FormOrientation = React.ComponentProps<typeof Form>['orientation'];

const requiredEmail = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .pipe(z.email('Please enter a valid email address'));

const simpleSchema = z.object({ email: requiredEmail });

/**
 * Real-world example:
 * A zod schema validates the form through TanStack Form. The error appears once the field is
 * blurred or submit is clicked. Try entering "jane" and tabbing away or submitting.
 */
function SimpleValidationExample({ orientation }: { orientation?: FormOrientation }) {
  const form = useForm({
    ...formDefaults,
    defaultValues: { email: '' },
    validators: [{ run: simpleSchema, triggers: ['change', 'blur'] }],
    onSubmit: ({ value }) => alert(`Submitted: ${value.email}`),
  });

  return (
    <Form
      orientation={orientation}
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => <TextField field={field} label="Email" placeholderText="you@example.com" />}
      </form.Field>
      <Form.Button>Submit</Form.Button>
    </Form>
  );
}

export const WithValidationSimple: Story = {
  args: {
    orientation: 'vertical',
  } as React.ComponentProps<typeof Form>,
  parameters: {
    docs: {
      description: {
        story:
          'Uses TanStack Form `useForm` with `formDefaults` and the `TextField` adapter from `@minneapolisstartribune/design-system-tanstack-form` and a **zod** schema. Enter an email without the @ symbol, then blur the field or click Submit to see the error.',
      },
      source: {
        code: FormDocSources.withValidationSimple,
        type: 'code',
      },
    },
  },
  render: (args) => <SimpleValidationExample orientation={args.orientation} />,
};

const multiFieldSchema = z.object({
  name: z.string(),
  email: requiredEmail,
  message: z.string().trim().min(1, 'Message is required'),
});

/**
 * Multi-field example: one field has an initial value, another is required and shows an error
 * when empty. Demonstrates defaultValues, a multi-field schema, and mixed optional/required fields.
 */
function MultiFieldValidationExample({ orientation }: { orientation?: FormOrientation }) {
  const form = useForm({
    ...formDefaults,
    defaultValues: { name: 'Jane Doe', email: '', message: '' },
    validators: [{ run: multiFieldSchema, triggers: ['change', 'blur'] }],
    onSubmit: ({ value }) => alert(`Submitted: ${value.name}, ${value.email}, ${value.message}`),
  });

  return (
    <Form
      orientation={orientation}
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="name">
        {(field) => <TextField field={field} label="Name" optional placeholderText="Your name" />}
      </form.Field>
      <form.Field name="email">
        {(field) => (
          <TextField
            field={field}
            label="Email"
            description="Where should we email updates?"
            placeholderText="you@example.com"
          />
        )}
      </form.Field>
      <form.Field name="message">
        {(field) => <TextField field={field} label="Message" placeholderText="Your message" />}
      </form.Field>
      <Form.Button>Submit</Form.Button>
    </Form>
  );
}

export const WithValidationMultiField: Story = {
  args: {
    orientation: 'vertical',
  } as React.ComponentProps<typeof Form>,
  parameters: {
    docs: {
      description: {
        story:
          'Multi-field form with **initial value**, **required field with error**, and **format validation**, all from one zod schema.\n\n' +
          '- **Name** — Optional; pre-filled with `"Jane Doe"`.\n' +
          '- **Email** — Required; shows an error if empty or not a valid email.\n' +
          '- **Message** — Required; shows "Message is required" if left empty.',
      },
      source: {
        code: FormDocSources.withValidationMultiField,
        type: 'code',
      },
    },
  },
  render: (args) => <MultiFieldValidationExample orientation={args.orientation} />,
};
