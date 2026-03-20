import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormControl } from '../../FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import {
  CalendarIcon,
  LockIcon,
  LocationIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from '@/icons';

const cellStyle = { minWidth: 0 };

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const meta = {
  title: 'Forms/FormControl/TextInput',
  component: FormControl.TextInput,
  parameters: {
    docs: {
      description: {
        component:
          'Text Inputs allow users to enter, edit, and/or view text such as names, email addresses, or search queries. They support multiple sizes, optional labels and descriptions, validation states, and can effortlessly be customized for a wide range of use cases via the prop API.',
      },
    },
  },
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
        Search: <SearchIcon aria-hidden />,
        Mail: <MailIcon aria-hidden />,
        User: <UserIcon aria-hidden />,
        Lock: <LockIcon aria-hidden />,
        Calendar: <CalendarIcon aria-hidden />,
        Phone: <PhoneIcon aria-hidden />,
        Location: <LocationIcon aria-hidden />,
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
    icon: 'Calendar',
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
        <SectionLabel>Size: Small</SectionLabel>
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
        <SectionLabel>Size: Medium (Default)</SectionLabel>
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
        <SectionLabel>Size: Large</SectionLabel>
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
        <SectionLabel>Label: Default</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput placeholderText="Placeholder text" aria-label="Default label" />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <SectionLabel>Label: Optional</SectionLabel>
        <FormGroup>
          <FormGroup.Label optional>Label</FormGroup.Label>
          <FormControl.TextInput placeholderText="Placeholder text" aria-label="Optional label" />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <SectionLabel>Label + Description</SectionLabel>
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
        <SectionLabel>Placeholder: True</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput placeholderText="Placeholder text" aria-label="With placeholder" />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <SectionLabel>Placeholder: False</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput aria-label="No placeholder" />
        </FormGroup>
      </div>

      {/* Rounded */}
      <div style={cellStyle}>
        <SectionLabel>Rounded</SectionLabel>
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
        <SectionLabel>Left Icon</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Search User Here"
            icon={<UserIcon aria-hidden />}
            iconPosition="start"
            aria-label="Left icon"
          />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <SectionLabel>Right Icon</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput
            placeholderText="Search User Here"
            icon={<UserIcon aria-hidden />}
            iconPosition="end"
            aria-label="Right icon"
          />
        </FormGroup>
      </div>

      {/* Caption */}
      <div style={cellStyle}>
        <SectionLabel>Caption: Informational</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput placeholderText="Placeholder text" aria-label="Info caption" />
          <FormGroup.Caption variant="info">Informational text here</FormGroup.Caption>
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <SectionLabel>Caption: Error</SectionLabel>
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
        <SectionLabel>Caption: Success</SectionLabel>
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
        <SectionLabel>State: Default</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextInput placeholderText="Placeholder text" aria-label="Default state" />
        </FormGroup>
      </div>
      <div style={cellStyle}>
        <SectionLabel>State: Filled</SectionLabel>
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
        <SectionLabel>State: Error</SectionLabel>
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
        <SectionLabel>State: Success</SectionLabel>
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
        <SectionLabel>State: Disabled</SectionLabel>
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
