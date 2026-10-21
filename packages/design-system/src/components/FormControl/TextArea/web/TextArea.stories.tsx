import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormControl } from '../../FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import styles from './TextArea.stories.module.scss';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.sectionLabel}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

// Filled styling follows the controlled `value`, so this keeps its own state to stay editable
const FilledTextArea = () => {
  const [value, setValue] = useState('Lorem ipsum');
  return (
    <FormControl.TextArea
      placeholderText="Placeholder text..."
      value={value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
    />
  );
};

const meta = {
  title: 'Forms/FormControl/TextArea',
  component: FormControl.TextArea,
  parameters: {
    docs: {
      description: {
        component:
          'Text areas allow users to enter longer, multi-line text such as comments, messages, or descriptions. They are designed for free-form input where users may need more space or the ability to review content before submission.',
      },
    },
  },
  argTypes: {
    placeholderText: {
      control: 'text',
      description: 'Placeholder text when empty',
    },
    resizable: {
      control: 'boolean',
      description: 'Lets users drag the corner to change the height',
    },
    rows: {
      control: 'number',
      description: 'Visible text lines before scrolling (min height is 64px)',
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
} satisfies Meta<typeof FormControl.TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  args: {
    placeholderText: 'Placeholder text...',
    resizable: true,
    isDisabled: false,
    isError: false,
    isSuccess: false,
  },
  render: (args) => (
    <FormGroup>
      <FormGroup.Label optional={false}>Label</FormGroup.Label>
      <FormControl.TextArea {...args} />
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
          'All variants per the design spec: Label, Resizable, Placeholder, Caption, and States.',
      },
    },
  },
  render: () => (
    <div className={styles.grid}>
      {/* Label variants */}
      <div className={styles.cell}>
        <SectionLabel>Label: Default</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextArea placeholderText="Placeholder text..." />
        </FormGroup>
      </div>
      <div className={styles.cell}>
        <SectionLabel>Label: Optional</SectionLabel>
        <FormGroup>
          <FormGroup.Label optional>Label</FormGroup.Label>
          <FormControl.TextArea placeholderText="Placeholder text..." />
        </FormGroup>
      </div>
      <div className={styles.cell}>
        <SectionLabel>Label + Description</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormGroup.Description>Description</FormGroup.Description>
          <FormControl.TextArea placeholderText="Placeholder text..." />
        </FormGroup>
      </div>
      <div className={styles.cell}>
        <SectionLabel>No Label</SectionLabel>
        <FormControl.TextArea placeholderText="Placeholder text..." aria-label="Comment" />
      </div>

      {/* Resizable */}
      <div className={styles.cell}>
        <SectionLabel>Resizable: True</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextArea placeholderText="Placeholder text..." />
        </FormGroup>
      </div>
      <div className={styles.cell}>
        <SectionLabel>Resizable: False</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextArea placeholderText="Placeholder text..." resizable={false} />
        </FormGroup>
      </div>

      {/* Placeholder */}
      <div className={styles.cell}>
        <SectionLabel>Placeholder: True</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextArea placeholderText="Placeholder text..." />
        </FormGroup>
      </div>
      <div className={styles.cell}>
        <SectionLabel>Placeholder: False</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextArea />
        </FormGroup>
      </div>

      {/* Caption */}
      <div className={styles.cell}>
        <SectionLabel>Caption: Informational</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextArea placeholderText="Placeholder text..." maxLength={200} />
          <FormGroup.Caption variant="info">0/200 characters</FormGroup.Caption>
        </FormGroup>
      </div>
      <div className={styles.cell}>
        <SectionLabel>Caption: Error</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextArea placeholderText="Placeholder text..." />
          <FormGroup.Caption variant="error">Error Message</FormGroup.Caption>
        </FormGroup>
      </div>

      {/* States */}
      <div className={styles.cell}>
        <SectionLabel>State: Default</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextArea placeholderText="Placeholder text..." />
        </FormGroup>
      </div>
      <div className={styles.cell}>
        <SectionLabel>State: Filled</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FilledTextArea />
        </FormGroup>
      </div>
      <div className={styles.cell}>
        <SectionLabel>State: Error</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextArea placeholderText="Placeholder text..." isError />
          <FormGroup.Caption variant="error">Error Message</FormGroup.Caption>
        </FormGroup>
      </div>
      <div className={styles.cell}>
        <SectionLabel>State: Disabled</SectionLabel>
        <FormGroup>
          <FormGroup.Label>Label</FormGroup.Label>
          <FormControl.TextArea placeholderText="Placeholder text..." isDisabled />
        </FormGroup>
      </div>
    </div>
  ),
};
