import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormGroup } from './FormGroup';
import { FormControl } from '../FormControl/FormControl';
import { IconName } from '../Icon/iconNames';

// Available FormControl types for the dropdown
const FORM_CONTROL_TYPES = ['TextInput'] as const;
type FormControlType = (typeof FORM_CONTROL_TYPES)[number];

// Custom args interface for the configurable story
interface FormGroupStoryArgs {
  showLabel: boolean;
  labelText: string;
  showDescription: boolean;
  descriptionText: string;
  showCaption: boolean;
  captionText: string;
  captionVariant: 'info' | 'error' | 'success';
  formControlType: FormControlType;
  placeholderText: string;
  inputSize: 'small' | 'medium' | 'large';
  showIcon: boolean;
  iconName: IconName;
  iconPosition: 'start' | 'end';
  rounded: boolean;
  isDisabled: boolean;
}

const meta = {
  title: 'Components/Actions & Inputs/FormGroup',
  component: FormGroup,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {
    showLabel: {
      control: 'boolean',
      description: 'Show label',
    },
    labelText: {
      control: 'text',
      description: 'Label text for the form field',
      if: { arg: 'showLabel' },
    },
    showDescription: {
      control: 'boolean',
      description: 'Show description',
    },
    descriptionText: {
      control: 'text',
      description: 'Description text',
      if: { arg: 'showDescription' },
    },
    showCaption: {
      control: 'boolean',
      description: 'Show caption/validation message',
    },
    captionText: {
      control: 'text',
      description: 'Caption text',
      if: { arg: 'showCaption' },
    },
    captionVariant: {
      control: 'select',
      options: ['info', 'error', 'success'],
      description: 'Caption variant',
      if: { arg: 'showCaption' },
    },
    formControlType: {
      control: 'select',
      options: [...FORM_CONTROL_TYPES],
      description: 'Type of form control to display',
    },
    // TextInput specific props
    placeholderText: {
      control: 'text',
      description: 'Placeholder text for TextInput',
      if: { arg: 'formControlType', eq: 'TextInput' },
    },
    inputSize: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the input',
      if: { arg: 'formControlType', eq: 'TextInput' },
    },
    showIcon: {
      control: 'boolean',
      description: 'Show icon in input',
      if: { arg: 'formControlType', eq: 'TextInput' },
    },
    iconName: {
      control: 'select',
      options: ['search', 'mail', 'user', 'lock', 'calendar', 'phone', 'location'] as IconName[],
      description: 'Icon to display',
      if: { arg: 'showIcon' },
    },
    iconPosition: {
      control: 'select',
      options: ['start', 'end'],
      description: 'Icon position',
      if: { arg: 'showIcon' },
    },
    rounded: {
      control: 'boolean',
      description: 'Rounded input corners',
      if: { arg: 'formControlType', eq: 'TextInput' },
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disable the FormGroup',
    },
  } as any, // Custom args don't match FormGroupProps
} satisfies Meta<typeof FormGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    showLabel: true,
    labelText: 'Email Address',
    showDescription: true,
    descriptionText: "We'll never share your email",
    showCaption: true,
    captionText: 'Please enter a valid email address',
    captionVariant: 'error',
    formControlType: 'TextInput',
    placeholderText: 'Enter your email',
    inputSize: 'medium',
    showIcon: true,
    iconName: 'mail',
    iconPosition: 'start',
    rounded: false,
    isDisabled: false,
  } as any,
  render: (args) => {
    const storyArgs = args as unknown as FormGroupStoryArgs;

    // Render the appropriate FormControl based on selection
    const renderFormControl = () => {
      switch (storyArgs.formControlType) {
        case 'TextInput':
          return (
            <FormControl.TextInput
              placeholderText={storyArgs.placeholderText}
              size={storyArgs.inputSize}
              icon={storyArgs.showIcon ? storyArgs.iconName : undefined}
              iconPosition={storyArgs.iconPosition}
              rounded={storyArgs.rounded}
              isDisabled={storyArgs.isDisabled}
            />
          );
        // Add any new form control subcomponents here as they are created
        default:
          return (
            <FormControl.TextInput
              placeholderText={storyArgs.placeholderText}
              size={storyArgs.inputSize}
            />
          );
      }
    };

    return (
      <FormGroup>
        {storyArgs.showLabel && storyArgs.labelText && (
          <FormGroup.Label>{storyArgs.labelText}</FormGroup.Label>
        )}
        {storyArgs.showDescription && storyArgs.descriptionText && (
          <FormGroup.Description>{storyArgs.descriptionText}</FormGroup.Description>
        )}
        {renderFormControl()}
        {storyArgs.showCaption && storyArgs.captionText && (
          <FormGroup.Caption variant={storyArgs.captionVariant}>
            {storyArgs.captionText}
          </FormGroup.Caption>
        )}
      </FormGroup>
    );
  },
};

export const Basic: Story = {
  args: {
    labelText: 'Email Address',
    placeholderText: 'Enter your email',
  } as any,
  render: (args) => {
    const storyArgs = args as unknown as FormGroupStoryArgs;
    return (
      <FormGroup>
        <FormGroup.Label>{storyArgs.labelText}</FormGroup.Label>
        <FormControl.TextInput placeholderText={storyArgs.placeholderText} />
      </FormGroup>
    );
  },
};

export const WithDescription: Story = {
  args: {
    labelText: 'Password',
    descriptionText: 'Must be at least 8 characters with a mix of letters and numbers',
    placeholderText: 'Enter your password',
  } as any,
  render: (args) => {
    const storyArgs = args as unknown as FormGroupStoryArgs;
    return (
      <FormGroup>
        <FormGroup.Label>{storyArgs.labelText}</FormGroup.Label>
        <FormGroup.Description>{storyArgs.descriptionText}</FormGroup.Description>
        <FormControl.TextInput type="password" placeholderText={storyArgs.placeholderText} />
      </FormGroup>
    );
  },
};

export const WithCaption: Story = {
  args: {
    labelText: 'Email',
    placeholderText: 'Enter your email',
    captionText: 'This field is required',
    captionVariant: 'error',
  } as any,
  render: (args) => {
    const storyArgs = args as unknown as FormGroupStoryArgs;
    return (
      <FormGroup>
        <FormGroup.Label>{storyArgs.labelText}</FormGroup.Label>
        <FormControl.TextInput placeholderText={storyArgs.placeholderText} />
        <FormGroup.Caption variant={storyArgs.captionVariant}>
          {storyArgs.captionText}
        </FormGroup.Caption>
      </FormGroup>
    );
  },
};

export const FullExample: Story = {
  args: {
    labelText: 'Email Address',
    descriptionText: "We'll never share your email",
    placeholderText: 'you@example.com',
    captionText: 'Please enter a valid email address',
    captionVariant: 'error',
    iconName: 'mail',
    inputSize: 'medium',
    formControlType: 'TextInput',
  } as any,
  render: (args) => {
    const storyArgs = args as unknown as FormGroupStoryArgs;
    return (
      <FormGroup>
        <FormGroup.Label>{storyArgs.labelText}</FormGroup.Label>
        <FormGroup.Description>{storyArgs.descriptionText}</FormGroup.Description>
        <FormControl.TextInput
          placeholderText={storyArgs.placeholderText}
          icon={storyArgs.iconName}
          iconPosition="start"
          size={storyArgs.inputSize}
        />
        <FormGroup.Caption variant={storyArgs.captionVariant}>
          {storyArgs.captionText}
        </FormGroup.Caption>
      </FormGroup>
    );
  },
};

export const CaptionVariants: Story = {
  args: {
    labelText: 'Password',
    placeholderText: 'Enter password',
    captionText: 'Passwords must be at least 8 characters',
    captionVariant: 'info',
  } as any,
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <FormGroup>
        <FormGroup.Label>Password</FormGroup.Label>
        <FormControl.TextInput type="password" placeholderText="Enter password" />
        <FormGroup.Caption variant="info">
          Passwords must be at least 8 characters
        </FormGroup.Caption>
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Email</FormGroup.Label>
        <FormControl.TextInput placeholderText="Enter email" />
        <FormGroup.Caption variant="error">Invalid email format</FormGroup.Caption>
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Username</FormGroup.Label>
        <FormControl.TextInput placeholderText="Enter username" />
        <FormGroup.Caption variant="success">Username is available</FormGroup.Caption>
      </FormGroup>
    </div>
  ),
};

export const MultipleFormGroups: Story = {
  args: {} as any,
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <FormGroup>
        <FormGroup.Label>Username</FormGroup.Label>
        <FormControl.TextInput placeholderText="Enter username" />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Password</FormGroup.Label>
        <FormControl.TextInput type="password" placeholderText="Enter password" />
      </FormGroup>
    </div>
  ),
};
