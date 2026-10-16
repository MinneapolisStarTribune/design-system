import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from '@minneapolisstartribune/design-system-tanstack-form';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '@/components/Button/web/Button';

const meta = {
  title: 'Forms/TanStack Form',
  excludeStories: ['TanStackFormDocSources'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TanStackFormDocSources = {
  simple: `
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { TextField } from '@minneapolisstartribune/design-system-tanstack-form';
import { Button } from '@minneapolisstartribune/design-system/web';

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required').pipe(z.email('Please enter a valid email address')),
});

const defaultValues: z.input<typeof schema> = { email: '' };

function SimpleValidationExample() {
  const form = useForm({
    defaultValues,
    validators: { onChange: schema, onBlur: schema },
    onSubmit: ({ value }) => alert(\`Submitted: \${value.email}\`),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => <TextField field={field} label="Email" placeholderText="you@example.com" />}
      </form.Field>
      <Button type="submit">Submit</Button>
    </form>
  );
}
`.trim(),
  multiField: `
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { TextField } from '@minneapolisstartribune/design-system-tanstack-form';
import { Button } from '@minneapolisstartribune/design-system/web';

const schema = z.object({
  name: z.string(),
  email: z.string().trim().min(1, 'Email is required').pipe(z.email('Please enter a valid email address')),
  message: z.string().trim().min(1, 'Message is required'),
});

const defaultValues: z.input<typeof schema> = { name: 'Jane Doe', email: '', message: '' };

function MultiFieldValidationExample() {
  const form = useForm({
    defaultValues,
    validators: { onChange: schema, onBlur: schema },
    onSubmit: ({ value }) => alert(\`Submitted: \${value.name}, \${value.email}, \${value.message}\`),
  });

  return (
    <form
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
      <Button type="submit">Submit</Button>
    </form>
  );
}
`.trim(),
} as const;

// Stories only, keeps fields and the button from touching
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 16,
} as const;

const requiredEmail = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .pipe(z.email('Please enter a valid email address'));

const simpleSchema = z.object({ email: requiredEmail });

const simpleDefaults: z.input<typeof simpleSchema> = { email: '' };

function SimpleValidationExample() {
  const form = useForm({
    defaultValues: simpleDefaults,
    validators: { onChange: simpleSchema, onBlur: simpleSchema },
    onSubmit: ({ value }) => alert(`Submitted: ${value.email}`),
  });

  return (
    <form
      style={formStyle}
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => <TextField field={field} label="Email" placeholderText="you@example.com" />}
      </form.Field>
      <Button type="submit">Submit</Button>
    </form>
  );
}

export const Simple: Story = {
  parameters: {
    docs: {
      source: { code: TanStackFormDocSources.simple, type: 'code' },
    },
  },
  render: () => <SimpleValidationExample />,
};

const multiFieldSchema = z.object({
  name: z.string(),
  email: requiredEmail,
  message: z.string().trim().min(1, 'Message is required'),
});

const multiFieldDefaults: z.input<typeof multiFieldSchema> = {
  name: 'Jane Doe',
  email: '',
  message: '',
};

function MultiFieldValidationExample() {
  const form = useForm({
    defaultValues: multiFieldDefaults,
    validators: { onChange: multiFieldSchema, onBlur: multiFieldSchema },
    onSubmit: ({ value }) => alert(`Submitted: ${value.name}, ${value.email}, ${value.message}`),
  });

  return (
    <form
      style={formStyle}
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
      <Button type="submit">Submit</Button>
    </form>
  );
}

export const MultiField: Story = {
  parameters: {
    docs: {
      source: { code: TanStackFormDocSources.multiField, type: 'code' },
    },
  },
  render: () => <MultiFieldValidationExample />,
};
