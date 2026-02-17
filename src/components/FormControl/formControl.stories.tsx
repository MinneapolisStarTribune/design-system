import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormControl } from './FormControl';
import { IconName } from '../Icon/iconNames';

// Custom args interface for TextInput storybook story example
interface TextInputStoryArgs {
  placeholderText: string;
  size: 'small' | 'medium' | 'large';
  showIcon: boolean;
  iconName: IconName;
  iconPosition: 'start' | 'end';
  rounded: boolean;
  isDisabled: boolean;
}

const meta = {
  title: 'Components/Actions & Inputs/FormControl',
  component: FormControl,
  parameters: {
    docs: {
      description: {
        component:
          'Text inputs allow users to enter short, single-line text such as names, email addresses, or search queries. They support multiple sizes, optional labels and descriptions, validation states, and icon affordances to accommodate a wide range of use cases across the product.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    placeholderText: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the input',
    },
    showIcon: {
      control: 'boolean',
      description: 'Show icon in input',
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
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the form control is disabled',
    },
  } as any,
} satisfies Meta<typeof FormControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  args: {
    placeholderText: 'Enter text',
    size: 'medium',
    showIcon: false,
    iconName: 'search',
    iconPosition: 'end',
    rounded: false,
    isDisabled: false,
  } as any,
  render: (args) => {
    const storyArgs = args as unknown as TextInputStoryArgs;
    return (
      <FormControl.TextInput
        placeholderText={storyArgs.placeholderText}
        size={storyArgs.size}
        icon={storyArgs.showIcon ? storyArgs.iconName : undefined}
        iconPosition={storyArgs.iconPosition}
        rounded={storyArgs.rounded}
        isDisabled={storyArgs.isDisabled}
      />
    );
  },
};
