import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, screen, waitFor } from 'storybook/test';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { Button } from '@/components/Button/web/Button';
import * as Popover from '@/components/Popover/Popover';
import { UtilityLabel } from '@/components/Typography/Utility';
import type { SelectProps } from '../Select.types';
import styles from './Select.stories.module.scss';

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 4 }}>
    <UtilityLabel size="small" weight="semibold">
      {children}
    </UtilityLabel>
  </div>
);

const OPTIONS = [
  { value: '1', label: 'Option-1' },
  { value: '2', label: 'Option-2' },
  { value: '3', label: 'Option-3' },
  { value: '4', label: 'Option-4' },
  { value: '5', label: 'Option-5' },
  { value: '6', label: 'Option-6' },
  { value: '7', label: 'Option-7' },
  { value: '8', label: 'Option-8' },
  { value: '9', label: 'Option-9' },
  { value: '10', label: 'Option-0', disabled: true },
];

const JoinedSelects = ({ testIdPrefix }: { testIdPrefix: string }) => (
  <div className={styles.joinedControls}>
    <FormControl.Select
      id={`${testIdPrefix}-first`}
      options={OPTIONS}
      value="1"
      size="small"
      className={styles.joinedSelect}
      dataTestId={`${testIdPrefix}-first`}
    />
    <FormControl.Select
      id={`${testIdPrefix}-second`}
      options={OPTIONS}
      value="2"
      size="small"
      className={styles.joinedSelect}
      dataTestId={`${testIdPrefix}-second`}
    />
  </div>
);

const meta = {
  title: 'Forms/FormControl/Select',
  component: FormControl.Select,
  parameters: {
    docs: {
      description: {
        component:
          'Select allows users to choose one option from a dropdown list. Supports multiple sizes, validation states, labels, and integrates with FormGroup.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Select visual size.',
    },
    rounded: {
      control: 'boolean',
      description: 'Applies pill-style rounded corners.',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Disables interaction and applies disabled styling.',
    },
    isError: {
      control: 'boolean',
      description: 'Applies error state styling.',
    },
    placeholderText: {
      control: 'text',
      description: 'Placeholder text shown when no option is selected.',
    },
    showPlaceholder: {
      control: 'boolean',
      description: 'Whether placeholder text is shown when value is empty.',
    },
    value: {
      control: 'text',
      description: 'Controlled selected option value.',
    },
  },
} satisfies Meta<typeof FormControl.Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const ConfigurableComponent = (args: Partial<SelectProps>) => {
  const [internalValue, setInternalValue] = useState<string | undefined>();

  const isControlled = args.value !== undefined;
  const value = isControlled ? args.value : internalValue;

  return (
    <FormGroup>
      <FormGroup.Label>Label</FormGroup.Label>

      <FormControl.Select
        id="select-configurable"
        {...args}
        options={args.options ?? OPTIONS}
        value={value}
        onChange={(val: string) => {
          if (!isControlled) setInternalValue(val);
          args.onChange?.(val);
        }}
      />

      {args.isError ? (
        <FormGroup.Caption variant="error">Error message</FormGroup.Caption>
      ) : (
        <FormGroup.Caption variant="info">Informational message</FormGroup.Caption>
      )}
    </FormGroup>
  );
};

export const Configurable: Story = {
  args: {
    size: 'medium',
    rounded: false,
    isDisabled: false,
    isError: false,
    placeholderText: 'Select an option',
    showPlaceholder: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<FormGroup>
  <FormGroup.Label>Country</FormGroup.Label>
  <FormControl.Select
    id="country-select"
    options={options}
    value={value}
    onChange={setValue}
    placeholderText="Select an option"
    showPlaceholder
    size="medium"
  />
  <FormGroup.Caption variant="info">Informational message</FormGroup.Caption>
</FormGroup>`,
      },
    },
  },
  render: (args) => <ConfigurableComponent {...args} />,
};

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
    docs: {
      source: {
        code: `<div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '2rem 1.5rem',
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Sizes */}
        <div style={cellStyle}>
          <SectionLabel>Size: Small</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} size="small" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Size: Medium</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} size="medium" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Size: Large</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} size="large" />
          </FormGroup>
        </div>

        {/* Radius */}
        <div style={cellStyle}>
          <SectionLabel>Radius: Pointy</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Radius: Rounded</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} rounded />
          </FormGroup>
        </div>

        {/* Label Variants */}
        <div style={cellStyle}>
          <SectionLabel>Label: Default</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Label: Optional</SectionLabel>
          <FormGroup>
            <FormGroup.Label optional>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Label + Description</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormGroup.Description>Description text here</FormGroup.Description>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>No Label</SectionLabel>
          <FormControl.Select options={OPTIONS} aria-label="No label select" />
        </div>

        {/* Placeholder */}
        <div style={cellStyle}>
          <SectionLabel>Placeholder: True</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select
              options={OPTIONS}
              placeholderText="Select an option"
              showPlaceholder
            />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Placeholder: False</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} showPlaceholder={false} />
          </FormGroup>
        </div>

        {/* States */}
        <div style={cellStyle}>
          <SectionLabel>State: Default</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Filled</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} value="1" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Error</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} isError />
            <FormGroup.Caption variant="error">Error message</FormGroup.Caption>
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Disabled</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} isDisabled />
          </FormGroup>
        </div>

        <div style={{ ...cellStyle, paddingBottom: 380 }}>
          <SectionLabel>State: Open</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} size="small" value="1" />
          </FormGroup>
        </div>
      </div>`,
      },
    },
  },
  render: () => {
    const cellStyle = { minWidth: 0 };

    return (
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
        {/* Sizes */}
        <div style={cellStyle}>
          <SectionLabel>Size: Small</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} size="small" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Size: Medium</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} size="medium" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Size: Large</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} size="large" />
          </FormGroup>
        </div>

        {/* Radius */}
        <div style={cellStyle}>
          <SectionLabel>Radius: Pointy</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Radius: Rounded</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} rounded />
          </FormGroup>
        </div>

        {/* Label Variants */}
        <div style={cellStyle}>
          <SectionLabel>Label: Default</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Label: Optional</SectionLabel>
          <FormGroup>
            <FormGroup.Label optional>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Label + Description</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormGroup.Description>Description text here</FormGroup.Description>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>No Label</SectionLabel>
          <FormControl.Select options={OPTIONS} aria-label="No label select" />
        </div>

        {/* Placeholder */}
        <div style={cellStyle}>
          <SectionLabel>Placeholder: True</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select
              options={OPTIONS}
              placeholderText="Select an option"
              showPlaceholder
            />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>Placeholder: False</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} showPlaceholder={false} />
          </FormGroup>
        </div>

        {/* States */}
        <div style={cellStyle}>
          <SectionLabel>State: Default</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Filled</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} value="1" />
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Error</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} isError dataTestId="select-error" />
            <FormGroup.Caption variant="error">Error message</FormGroup.Caption>
          </FormGroup>
        </div>

        <div style={cellStyle}>
          <SectionLabel>State: Disabled</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            <FormControl.Select options={OPTIONS} isDisabled dataTestId="select-disabled" />
          </FormGroup>
        </div>

        <div className={styles.regressionExample}>
          <SectionLabel>Joined controls</SectionLabel>
          <JoinedSelects testIdPrefix="select-joined" />
        </div>

        <div className={styles.regressionExample}>
          <SectionLabel>Inside Popover</SectionLabel>
          <Popover.Root
            aria-label="Select inside Popover"
            trigger={<Button dataTestId="select-popover-trigger">Open Select</Button>}
          >
            <Popover.Body dataTestId="select-popover-body">
              <FormControl.Select
                id="select-popover"
                options={OPTIONS}
                value="1"
                dataTestId="select-popover"
              />
            </Popover.Body>
          </Popover.Root>
        </div>

        <div className={styles.regressionExample}>
          <SectionLabel>Joined controls inside Popover</SectionLabel>
          <Popover.Root
            aria-label="Joined Selects inside Popover"
            trigger={
              <Button dataTestId="select-popover-joined-trigger">Open joined Selects</Button>
            }
          >
            <Popover.Body dataTestId="select-popover-joined-body">
              <JoinedSelects testIdPrefix="select-popover-joined" />
            </Popover.Body>
          </Popover.Root>
        </div>

        {/* Reserves room for the absolutely positioned dropdown (317px max-height + 8px offset) */}
        <div style={{ ...cellStyle, paddingBottom: 335 }}>
          <SectionLabel>State: Open</SectionLabel>
          <FormGroup>
            <FormGroup.Label>Label</FormGroup.Label>
            {/* Small size checks option text stays 16px regardless of trigger size */}
            <FormControl.Select options={OPTIONS} size="small" value="1" dataTestId="select-open" />
          </FormGroup>
        </div>
      </div>
    );
  },
  // Capture the clipped Popover edges and joined seam in Chromatic's final snapshot.
  play: async ({ canvas, userEvent }) => {
    // findBy waits out the decorator's async theme load
    const select = await canvas.findByTestId('select-open');
    let focusColor: string | undefined;
    const dimensions = (element: HTMLElement) => {
      const { width, height } = element.getBoundingClientRect();
      return { width, height };
    };
    const keyboardFocus = async (element: HTMLElement) => {
      for (let count = 0; document.activeElement !== element && count < 40; count++) {
        await userEvent.tab();
      }
      await expect(element).toHaveFocus();
    };
    const expectActive = async (
      element: HTMLElement,
      size: ReturnType<typeof dimensions>,
      borderColor?: string
    ) => {
      await waitFor(() => {
        const style = getComputedStyle(element);
        const color = focusColor ?? style.borderTopColor;
        expect(style.boxShadow).toBe(`${color} 0px 0px 0px 1px inset`);
        for (const side of ['top', 'right', 'bottom', 'left']) {
          expect(style.getPropertyValue(`border-${side}-width`)).toBe('1px');
          expect(style.getPropertyValue(`border-${side}-color`)).toBe(borderColor ?? color);
        }
        expect(dimensions(element)).toEqual(size);
      });
      focusColor ??= getComputedStyle(element).borderTopColor;
    };
    const checkControl = async (element: HTMLElement, errorColor?: string) => {
      const size = dimensions(element);
      await keyboardFocus(element);
      await expect(element).toHaveAttribute('aria-expanded', 'false');
      await expectActive(element, size);
      await userEvent.hover(element);
      await expectActive(element, size);
      await userEvent.click(element);
      await expect(element).toHaveAttribute('aria-expanded', 'true');
      await expect(await screen.findByRole('listbox')).toBeVisible();
      await expectActive(element, size, errorColor);
      await userEvent.click(element);
    };

    await checkControl(select);
    for (const id of ['select-joined-first', 'select-joined-second']) {
      await checkControl(canvas.getByTestId(id));
    }
    for (const prefix of ['select-popover', 'select-popover-joined']) {
      const trigger = canvas.getByTestId(`${prefix}-trigger`);
      await keyboardFocus(trigger);
      await userEvent.keyboard('{Enter}');
      const ids = prefix.endsWith('joined') ? [`${prefix}-first`, `${prefix}-second`] : [prefix];
      await waitFor(() => expect(screen.getByTestId(ids[0])).toHaveFocus());
      for (const id of ids) await checkControl(await screen.findByTestId(id));
      await userEvent.click(trigger);
    }

    const error = canvas.getByTestId('select-error');
    await checkControl(error, getComputedStyle(error).borderTopColor);
    const disabled = canvas.getByTestId('select-disabled');
    const disabledSize = dimensions(disabled);
    const disabledBorder = getComputedStyle(disabled).borderTopColor;
    await userEvent.click(disabled);
    await expect(disabled).toHaveAttribute('aria-expanded', 'false');
    await expect(disabled).toHaveAttribute('tabindex', '-1');
    await expect(getComputedStyle(disabled).boxShadow).toBe('none');
    await expect(getComputedStyle(disabled).borderTopColor).toBe(disabledBorder);
    await expect(dimensions(disabled)).toEqual(disabledSize);

    await userEvent.click(canvas.getByTestId('select-popover-joined-trigger'));
    await userEvent.click(await screen.findByTestId('select-popover-joined-first'));
    // The listbox is portaled out of the combobox.
    await expect(await screen.findByRole('listbox')).toBeVisible();
  },
};
