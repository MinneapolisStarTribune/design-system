import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormGroup } from './FormGroup';

import { FormControl } from '@/components/FormControl/FormControl';
import {
  FORM_GROUP_CAPTION_VARIANTS,
  type FormGroupCaptionVariant,
} from '@/components/FormGroup/web/caption/FormGroup.Caption';

import {
  CalendarIcon,
  LocationIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
} from '@/icons';

const STORY_ICON_NAMES = [
  'search',
  'mail',
  'user',
  'lock',
  'calendar',
  'phone',
  'location',
] as const;
type StoryIconName = (typeof STORY_ICON_NAMES)[number];

const STORY_ICON_MAP: Record<StoryIconName, React.ReactNode> = {
  search: <SearchIcon />,
  mail: <MailIcon />,
  user: <UserIcon />,
  lock: <LockIcon />,
  calendar: <CalendarIcon />,
  phone: <PhoneIcon />,
  location: <LocationIcon />,
};

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
  captionVariant: FormGroupCaptionVariant;
  formControlType: FormControlType;
  placeholderText: string;
  inputSize: 'small' | 'medium' | 'large';
  showIcon: boolean;
  iconName: StoryIconName;
  iconPosition: 'start' | 'end';
  rounded: boolean;
  isDisabled: boolean;
}

const meta = {
  title: 'Components/Actions & Inputs/FormGroup',
  component: FormGroup,
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
      options: [...FORM_GROUP_CAPTION_VARIANTS],
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
      options: [...STORY_ICON_NAMES],
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
              icon={storyArgs.showIcon ? STORY_ICON_MAP[storyArgs.iconName] : undefined}
              iconPosition={storyArgs.iconPosition}
              rounded={storyArgs.rounded}
              isDisabled={storyArgs.isDisabled}
            />
          );
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

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {} as any,
  render: () => {
    const variants = [
      {
        label: 'Label only',
        render: () => (
          <FormGroup>
            <FormGroup.Label>Email</FormGroup.Label>
            <FormControl.TextInput placeholderText="Placeholder" />
          </FormGroup>
        ),
      },
      {
        label: 'Label (optional)',
        render: () => (
          <FormGroup>
            <FormGroup.Label optional>Email</FormGroup.Label>
            <FormControl.TextInput placeholderText="Placeholder" />
          </FormGroup>
        ),
      },
      {
        label: 'Label + Description',
        render: () => (
          <FormGroup>
            <FormGroup.Label>Email</FormGroup.Label>
            <FormGroup.Description>We&apos;ll never share your email</FormGroup.Description>
            <FormControl.TextInput placeholderText="you@example.com" />
          </FormGroup>
        ),
      },
      {
        label: 'Label + Description + Caption',
        render: () => (
          <FormGroup>
            <FormGroup.Label>Email</FormGroup.Label>
            <FormGroup.Description>We&apos;ll never share your email</FormGroup.Description>
            <FormControl.TextInput placeholderText="you@example.com" />
            <FormGroup.Caption variant="error">
              Please enter a valid email address
            </FormGroup.Caption>
          </FormGroup>
        ),
      },
      {
        label: 'Label + Caption (info)',
        render: () => (
          <FormGroup>
            <FormGroup.Label>Username</FormGroup.Label>
            <FormControl.TextInput placeholderText="Enter username" />
            <FormGroup.Caption variant="info">Choose a unique username</FormGroup.Caption>
          </FormGroup>
        ),
      },
      {
        label: 'Label + Caption (error)',
        render: () => (
          <FormGroup>
            <FormGroup.Label>Password</FormGroup.Label>
            <FormControl.TextInput type="password" placeholderText="Enter password" />
            <FormGroup.Caption variant="error">Password is required</FormGroup.Caption>
          </FormGroup>
        ),
      },
      {
        label: 'Label + Caption (success)',
        render: () => (
          <FormGroup>
            <FormGroup.Label>Password</FormGroup.Label>
            <FormControl.TextInput type="password" placeholderText="Enter password" />
            <FormGroup.Caption variant="success">Account created successfully</FormGroup.Caption>
          </FormGroup>
        ),
      },
      {
        label: 'With icon',
        render: () => (
          <FormGroup>
            <FormGroup.Label>Search</FormGroup.Label>
            <FormControl.TextInput
              placeholderText="Search"
              icon={<SearchIcon />}
              iconPosition="start"
            />
          </FormGroup>
        ),
      },
    ];
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {variants.map((v) => (
          <div key={v.label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{v.label}</span>
            {v.render()}
          </div>
        ))}
      </div>
    );
  },
};
