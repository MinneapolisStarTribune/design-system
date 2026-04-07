import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from './Form';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { FormControl } from '@/components/FormControl/FormControl';
import { useFormLogic } from '../useFormLogic';

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
function SimpleValidationExample() {
  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormLogic({
    initialValues: { email: '' },
    validateOnSubmit: true,
    validateOnBlur: true,
    validate: (vals) => {
      const email = (vals.email as string)?.trim() ?? '';
      if (!email) return { email: 'Email is required' };
      if (!email.includes('@')) return { email: 'Please enter a valid email address (include @)' };
      return {};
    },
    onSubmit: (vals) => {
      alert(\`Submitted: \${vals.email}\`);
    },
  });

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <FormControl.TextInput
          name="email"
          placeholderText="you@example.com"
          value={values.email as string}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        {errors.email && (
          <FormGroup.Caption variant="error">{errors.email}</FormGroup.Caption>
        )}
      </FormGroup>
      <Form.Button>Submit</Form.Button>
    </Form>
  );
}
`.trim(),
  withValidationMultiField: `
function MultiFieldValidationExample() {
  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormLogic({
    initialValues: {
      name: 'Jane Doe',
      email: '',
      message: '',
    },
    validateOnSubmit: true,
    validateOnBlur: true,
    validate: (vals) => {
      const email = (vals.email as string)?.trim() ?? '';
      const message = (vals.message as string)?.trim() ?? '';
      const errs: Record<string, string> = {};
      if (!email) errs.email = 'Email is required';
      else if (!email.includes('@')) errs.email = 'Please enter a valid email address (include @)';
      if (!message) errs.message = 'Message is required';
      return errs;
    },
    onSubmit: (vals) => {
      alert(\`Submitted: \${vals.name}, \${vals.email}, \${vals.message}\`);
    },
  });

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <FormGroup.Label optional>Name</FormGroup.Label>
        <FormControl.TextInput
          name="name"
          placeholderText="Your name"
          value={values.name as string}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
        />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <FormControl.TextInput
          name="email"
          placeholderText="you@example.com"
          value={values.email as string}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        {errors.email && (
          <FormGroup.Caption variant="error">{errors.email}</FormGroup.Caption>
        )}
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Message</FormGroup.Label>
        <FormControl.TextInput
          name="message"
          placeholderText="Your message"
          value={values.message as string}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
        />
        {errors.message && (
          <FormGroup.Caption variant="error">{errors.message}</FormGroup.Caption>
        )}
      </FormGroup>
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

/**
 * Real-world example:
 * Validation is provided by the app (email must contain `@`). Error appears when the field
 * is blurred without `@` or when submit is clicked. Try entering "jane" and tabbing away or submitting.
 */
function SimpleValidationExample({ orientation }: { orientation?: FormOrientation }) {
  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormLogic({
    initialValues: { email: '' },
    validateOnSubmit: true,
    validateOnBlur: true,
    validate: (vals) => {
      const email = (vals.email as string)?.trim() ?? '';
      if (!email) return { email: 'Email is required' };
      if (!email.includes('@')) return { email: 'Please enter a valid email address (include @)' };
      return {};
    },
    onSubmit: (vals) => {
      alert(`Submitted: ${vals.email}`);
    },
  });

  return (
    <Form onSubmit={handleSubmit} orientation={orientation}>
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <FormControl.TextInput
          name="email"
          placeholderText="you@example.com"
          value={values.email as string}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('email', e.target.value)
          }
          onBlur={() => handleBlur('email')}
        />
        {errors.email && <FormGroup.Caption variant="error">{errors.email}</FormGroup.Caption>}
      </FormGroup>
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
          'Uses **useFormLogic** for state and validation. Enter an email without the @ symbol, then blur the field or click Submit to see the error.\n\n' +
          '**useFormLogic** options:\n' +
          '- **initialValues** — Initial field values (keyed by field name).\n' +
          '- **onSubmit** — Called when the form is submitted and validation passes (if validate is provided).\n' +
          '- **validate** — Optional. Function that receives current values and returns an object of field names to error messages (omit or undefined = no error).\n' +
          '- **validateOnSubmit** — Run validate on form submit. Default: `true`.\n' +
          '- **validateOnBlur** — Run validate when a field blurs and set that field’s error. Default: `false`.',
      },
      source: {
        code: FormDocSources.withValidationSimple,
        type: 'code',
      },
    },
  },
  render: (args) => <SimpleValidationExample orientation={args.orientation} />,
};

/**
 * Multi-field example: one field has an initial value, another is required and shows an error
 * when empty. Demonstrates initialValues, multiple validations, and mixed optional/required fields.
 */
function MultiFieldValidationExample({ orientation }: { orientation?: FormOrientation }) {
  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormLogic({
    initialValues: {
      name: 'Jane Doe',
      email: '',
      message: '',
    },
    validateOnSubmit: true,
    validateOnBlur: true,
    validate: (vals) => {
      const email = (vals.email as string)?.trim() ?? '';
      const message = (vals.message as string)?.trim() ?? '';
      const errs: Record<string, string> = {};
      if (!email) errs.email = 'Email is required';
      else if (!email.includes('@')) errs.email = 'Please enter a valid email address (include @)';
      if (!message) errs.message = 'Message is required';
      return errs;
    },
    onSubmit: (vals) => {
      alert(`Submitted: ${vals.name}, ${vals.email}, ${vals.message}`);
    },
  });

  return (
    <Form onSubmit={handleSubmit} orientation={orientation}>
      <FormGroup>
        <FormGroup.Label optional>Name</FormGroup.Label>
        <FormControl.TextInput
          name="name"
          placeholderText="Your name"
          value={values.name as string}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('name', e.target.value)
          }
          onBlur={() => handleBlur('name')}
        />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <FormGroup.Description>Where should we email updates??</FormGroup.Description>
        <FormControl.TextInput
          name="email"
          placeholderText="you@example.com"
          value={values.email as string}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('email', e.target.value)
          }
          onBlur={() => handleBlur('email')}
        />
        {errors.email && <FormGroup.Caption variant="error">{errors.email}</FormGroup.Caption>}
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Message</FormGroup.Label>
        <FormControl.TextInput
          name="message"
          placeholderText="Your message"
          value={values.message as string}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('message', e.target.value)
          }
          onBlur={() => handleBlur('message')}
        />
        {errors.message && <FormGroup.Caption variant="error">{errors.message}</FormGroup.Caption>}
      </FormGroup>
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
          'Multi-field form with **initial value**, **required field with error**, and **format validation**.\n\n' +
          '- **Name** — Optional; pre-filled with `"Jane Doe"`.\n' +
          '- **Email** — Required; shows an error if empty or if the value doesn’t include `@`.\n' +
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
