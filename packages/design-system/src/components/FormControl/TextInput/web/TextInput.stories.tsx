import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormControl } from '../../FormControl';
import { FormGroup } from '@/components/FormGroup/FormGroup';

const labelStyle = {
  display: 'block' as const,
  fontSize: '0.75rem',
  fontWeight: 600,
  marginBottom: 4,
};

const cellStyle = { minWidth: 0 };

const meta = {
  title: 'Components/Actions & Inputs/TextInput',
  component: FormControl.TextInput,
  parameters: {
    docs: {
      description: {
        component:
          'Text Inputs allow users to enter, edit, and/or view text such as names, email addresses, or search queries. They support multiple sizes, optional labels and descriptions, validation states, and can effortlessly be customized for a wide range of use cases via the prop API.',
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
      mapping: {
        None: undefined,
        Search: 'search',
        Mail: 'mail',
        User: 'user',
        Lock: 'lock',
        Calendar: 'calendar',
        Phone: 'phone',
        Location: 'location',
      },
      options: ['None', 'Search', 'Mail', 'User', 'Lock', 'Calendar', 'Phone', 'Location'],
      description: 'Optional icon',
    },
    iconPosition: {
      control: 'radio',
      options: ['start', 'end'],
      description: 'Icon position (when icon is set)',
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

export const Configurable: Story = {
  args: {
    placeholderText: 'Placeholder text',
    size: 'medium',
    icon: 'calendar',
    iconPosition: 'end',
    rounded: false,
    isDisabled: false,
    isError: false,
    isSuccess: false,
  },
  render: (args) => (
    <FormGroup>
      <FormGroup.Label optional={false}>Label</FormGroup.Label>
      <FormControl.TextInput {...args} aria-label="Configurable input" />
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
          'All variants per the design spec: Size, Label, Placeholder, Icons, Caption, and States.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '2rem 1.5rem',
        padding: '1.5rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Size */}
      <div style={cellStyle}>
        <span style={labelStyle}>Size: Small</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            size="small"
            aria-label="Small"
          />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Size: Medium (Default)</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            size="medium"
            aria-label="Medium"
          />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Size: Large</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            size="large"
            aria-label="Large"
          />
        </FormGroup>
      </div>

      {/* Label variants */}
      <div style={cellStyle}>
        <span style={labelStyle}>Label: Default</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput placeholderText="Placeholder text" aria-label="Default label" />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Label: Optional</span>
        <FormGroup>
          <FormGroup.Label optional>Label</FormGroup.Label>
          <FormControl.TextInput placeholderText="Placeholder text" aria-label="Optional label" />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Label + Description</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormGroup.Description>Description of the label</FormGroup.Description>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            aria-label="Label with description"
          />
        </FormGroup>
      </div>

      {/* Placeholder */}
      <div style={cellStyle}>
        <span style={labelStyle}>Placeholder: True</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput placeholderText="Placeholder text" aria-label="With placeholder" />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Placeholder: False</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput aria-label="No placeholder" />
        </FormGroup>
      </div>

      {/* Rounded */}
      <div style={cellStyle}>
        <span style={labelStyle}>Rounded</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            rounded
            aria-label="Rounded input"
          />
        </FormGroup>
      </div>

      {/* Icons */}
      <div style={cellStyle}>
        <span style={labelStyle}>Left Icon</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Search User Here"
            icon="user"
            iconPosition="start"
            aria-label="Left icon"
          />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Right Icon</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Search User Here"
            icon="user"
            iconPosition="end"
            aria-label="Right icon"
          />
        </FormGroup>
      </div>

      {/* Caption */}
      <div style={cellStyle}>
        <span style={labelStyle}>Caption: Informational</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput placeholderText="Placeholder text" aria-label="Info caption" />
          <FormGroup.Caption variant="info">Informational text here</FormGroup.Caption>
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Caption: Error</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            isError
            aria-label="Error caption"
          />
          <FormGroup.Caption variant="error">Error message here</FormGroup.Caption>
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>Caption: Success</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            isSuccess
            aria-label="Success caption"
          />
          <FormGroup.Caption variant="success">Success message here</FormGroup.Caption>
        </FormGroup>
      </div>

      {/* States */}
      <div style={cellStyle}>
        <span style={labelStyle}>State: Default</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput placeholderText="Placeholder text" aria-label="Default state" />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>State: Filled</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            value="Some text"
            aria-label="Filled state"
          />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>State: Error</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            isError
            aria-label="Error state"
          />
          <FormGroup.Caption variant="error">Error message</FormGroup.Caption>
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>State: Success</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            isSuccess
            aria-label="Success state"
          />
          <FormGroup.Caption variant="success">Success message</FormGroup.Caption>
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <span style={labelStyle}>State: Disabled</span>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Placeholder text"
            isDisabled
            aria-label="Disabled state"
          />
        </FormGroup>
      </div>
    </div>
  ),
};
