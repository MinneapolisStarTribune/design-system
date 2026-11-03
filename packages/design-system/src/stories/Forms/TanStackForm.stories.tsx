import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  CheckboxField,
  CheckboxGroupField,
  MultiSelectField,
  NumberField,
  PasswordField,
  RadioGroupField,
  SelectField,
  SwitchField,
  TextAreaField,
  TextField,
  ToggleGroupField,
} from '@minneapolisstartribune/design-system-tanstack-form';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from '@/components/Button/web/Button';
import * as ToggleGroup from '@/components/ToggleGroup/ToggleGroup';
import styles from './TanStackForm.module.scss';

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
  allAdapters: `
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import {
  CheckboxField,
  CheckboxGroupField,
  MultiSelectField,
  NumberField,
  PasswordField,
  RadioGroupField,
  SelectField,
  SwitchField,
  TextAreaField,
  ToggleGroupField,
} from '@minneapolisstartribune/design-system-tanstack-form';
import { Button, ToggleGroup } from '@minneapolisstartribune/design-system/web';

const schema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
  age: z
    .number()
    .int()
    .min(18, 'Must be 18 or older')
    .optional()
    .refine((age) => age !== undefined, 'Age is required'),
  state: z.string().min(1, 'Pick a state'),
  topics: z.array(z.string()).min(1, 'Pick at least one topic'),
  comments: z.string().trim().min(1, 'Add a comment').max(200, 'Keep it under 200 characters'),
  plan: z.string().min(1, 'Pick a plan'),
  newsletters: z.array(z.string()).min(1, 'Pick at least one newsletter'),
  alerts: z.boolean(),
  view: z.enum(['list', 'grid']),
  terms: z.boolean().refine((accepted) => accepted, 'Accept the terms to continue'),
});

// The form holds what's been entered so far, which is the schema's input type.
const defaultValues: z.input<typeof schema> = {
  password: '',
  age: undefined,
  state: '',
  topics: [],
  comments: '',
  plan: 'digital',
  newsletters: [],
  alerts: true,
  view: 'list',
  terms: false,
};

function AllAdaptersExample() {
  const form = useForm({
    defaultValues,
    validators: { onChange: schema, onBlur: schema },
    onSubmit: ({ value }) => alert(JSON.stringify(value, null, 2)),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="password">
        {(field) => <PasswordField field={field} label="Password" autoComplete="new-password" />}
      </form.Field>
      <form.Field name="age">
        {(field) => <NumberField field={field} label="Age" />}
      </form.Field>
      <form.Field name="state">
        {(field) => (
          <SelectField
            field={field}
            label="State"
            options={[
              { value: 'mn', label: 'Minnesota' },
              { value: 'wi', label: 'Wisconsin' },
            ]}
          />
        )}
      </form.Field>
      <form.Field name="topics">
        {(field) => (
          <MultiSelectField
            field={field}
            label="Topics"
            options={[
              { value: 'news', label: 'News' },
              { value: 'sports', label: 'Sports' },
              { value: 'food', label: 'Food' },
            ]}
          />
        )}
      </form.Field>
      <form.Field name="comments">
        {(field) => (
          <TextAreaField field={field} label="Comments" caption="Up to 200 characters" maxLength={200} />
        )}
      </form.Field>
      <form.Field name="plan">
        {(field) => (
          <RadioGroupField
            field={field}
            label="Plan"
            options={[
              { value: 'print', title: 'Print' },
              { value: 'digital', title: 'Digital' },
            ]}
          />
        )}
      </form.Field>
      <form.Field name="newsletters">
        {(field) => (
          <CheckboxGroupField
            field={field}
            label="Newsletters"
            options={[
              { value: 'morning', title: 'Morning briefing' },
              { value: 'evening', title: 'Evening wrap' },
            ]}
          />
        )}
      </form.Field>
      <form.Field name="alerts">
        {(field) => <SwitchField field={field} label="Breaking news alerts" />}
      </form.Field>
      <form.Field name="view">
        {(field) => (
          <ToggleGroupField field={field} label="View">
            <ToggleGroup.Item value="list">List</ToggleGroup.Item>
            <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
          </ToggleGroupField>
        )}
      </form.Field>
      <form.Field name="terms">
        {(field) => <CheckboxField field={field} label="I accept the terms" />}
      </form.Field>
      <Button type="submit">Submit</Button>
    </form>
  );
}
`.trim(),
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
      className={styles.form}
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
      className={styles.form}
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

const allAdaptersSchema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
  age: z
    .number()
    .int()
    .min(18, 'Must be 18 or older')
    .optional()
    .refine((age) => age !== undefined, 'Age is required'),
  state: z.string().min(1, 'Pick a state'),
  topics: z.array(z.string()).min(1, 'Pick at least one topic'),
  comments: z.string().trim().min(1, 'Add a comment').max(200, 'Keep it under 200 characters'),
  plan: z.string().min(1, 'Pick a plan'),
  newsletters: z.array(z.string()).min(1, 'Pick at least one newsletter'),
  alerts: z.boolean(),
  view: z.enum(['list', 'grid']),
  terms: z.boolean().refine((accepted) => accepted, 'Accept the terms to continue'),
});

// The form holds what's been entered so far, which is the schema's input type.
const allAdaptersDefaults: z.input<typeof allAdaptersSchema> = {
  password: '',
  age: undefined,
  state: '',
  topics: [],
  comments: '',
  plan: 'digital',
  newsletters: [],
  alerts: true,
  view: 'list',
  terms: false,
};

function AllAdaptersExample() {
  const form = useForm({
    defaultValues: allAdaptersDefaults,
    validators: { onChange: allAdaptersSchema, onBlur: allAdaptersSchema },
    onSubmit: ({ value }) => alert(JSON.stringify(value, null, 2)),
  });

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className={styles.wideField}>
        <form.Field name="password">
          {(field) => <PasswordField field={field} label="Password" autoComplete="new-password" />}
        </form.Field>
      </div>
      <div className={styles.wideField}>
        <form.Field name="age">{(field) => <NumberField field={field} label="Age" />}</form.Field>
      </div>
      <div className={styles.wideField}>
        <form.Field name="state">
          {(field) => (
            <SelectField
              field={field}
              label="State"
              options={[
                { value: 'mn', label: 'Minnesota' },
                { value: 'wi', label: 'Wisconsin' },
              ]}
            />
          )}
        </form.Field>
      </div>
      <div className={styles.wideField}>
        <form.Field name="topics">
          {(field) => (
            <MultiSelectField
              field={field}
              label="Topics"
              options={[
                { value: 'news', label: 'News' },
                { value: 'sports', label: 'Sports' },
                { value: 'food', label: 'Food' },
              ]}
            />
          )}
        </form.Field>
      </div>
      <div className={styles.wideField}>
        <form.Field name="comments">
          {(field) => (
            <TextAreaField
              field={field}
              label="Comments"
              caption="Up to 200 characters"
              maxLength={200}
            />
          )}
        </form.Field>
      </div>
      <form.Field name="plan">
        {(field) => (
          <RadioGroupField
            field={field}
            label="Plan"
            options={[
              { value: 'print', title: 'Print' },
              { value: 'digital', title: 'Digital' },
            ]}
          />
        )}
      </form.Field>
      <form.Field name="newsletters">
        {(field) => (
          <CheckboxGroupField
            field={field}
            label="Newsletters"
            options={[
              { value: 'morning', title: 'Morning briefing' },
              { value: 'evening', title: 'Evening wrap' },
            ]}
          />
        )}
      </form.Field>
      <form.Field name="alerts">
        {(field) => <SwitchField field={field} label="Breaking news alerts" />}
      </form.Field>
      <div className={styles.wideField}>
        <form.Field name="view">
          {(field) => (
            <ToggleGroupField field={field} label="View" fullWidth>
              <ToggleGroup.Item value="list">List</ToggleGroup.Item>
              <ToggleGroup.Item value="grid">Grid</ToggleGroup.Item>
            </ToggleGroupField>
          )}
        </form.Field>
      </div>
      <form.Field name="terms">
        {(field) => <CheckboxField field={field} label="I accept the terms" />}
      </form.Field>
      <Button type="submit">Submit</Button>
    </form>
  );
}

export const AllAdapters: Story = {
  parameters: {
    docs: {
      source: { code: TanStackFormDocSources.allAdapters, type: 'code' },
    },
  },
  render: () => <AllAdaptersExample />,
};
