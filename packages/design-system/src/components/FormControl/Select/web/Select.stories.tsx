import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, waitFor, within } from 'storybook/test';
import { FormControl } from '@/components/FormControl/FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';
import { UtilityLabel } from '@/components/Typography/Utility';
import type { SelectProps } from '../Select.types';

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

const SelectTable = ({ constrained = true }: { constrained?: boolean }) => (
  <div style={{ padding: 24 }}>
    <div
      data-testid="select-table-scroll"
      style={{
        height: constrained ? 'min(420px, calc(100vh - 48px))' : undefined,
        overflow: 'auto',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {Array.from({ length: 20 }, (_, index) => (
            <tr key={index}>
              <td style={{ padding: 12 }}>Game {index + 1}</td>
              <td style={{ padding: 12, width: '60%' }}>
                <FormControl.Select
                  id={`table-status-${index}`}
                  placeholderText={`Status for game ${index + 1}`}
                  options={OPTIONS}
                  value="1"
                  size="small"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const ScrollableTable: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        story: 'The last row opens upward without adding scrollable space or moving the table.',
      },
    },
  },
  render: () => <SelectTable />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const scroller = await canvas.findByTestId('select-table-scroll');
    const table = within(scroller).getByRole('table');
    const page = canvasElement.ownerDocument.documentElement;
    const body = within(canvasElement.ownerDocument.body);
    const first = canvas.getByRole('combobox', { name: 'Status for game 1' });
    const last = canvas.getByRole('combobox', { name: 'Status for game 20' });
    const measurements = () => ({
      scrollTop: scroller.scrollTop,
      scrollHeight: scroller.scrollHeight,
      tableHeight: table.getBoundingClientRect().height,
      pageScroll: page.scrollTop,
      pageHeight: page.scrollHeight,
    });

    scroller.scrollTop = scroller.scrollHeight;
    last.scrollIntoView({ block: 'nearest' });
    const before = measurements();
    const triggerTop = last.getBoundingClientRect().top;
    await userEvent.click(last);
    await waitFor(() => {
      const menu = body.getByRole('listbox').getBoundingClientRect();
      expect(menu.height).toBeGreaterThan(0);
      expect(menu.bottom).toBeLessThanOrEqual(triggerTop);
      expect(menu.top).toBeGreaterThanOrEqual(scroller.getBoundingClientRect().top);
      expect(last.getBoundingClientRect().top).toBe(triggerTop);
      expect(measurements()).toEqual(before);
    });
    // Navigating a long menu scrolls only the options, never its containing table/page.
    await userEvent.keyboard('{ArrowDown>8/}');
    await expect(body.getByRole('listbox').scrollTop).toBeGreaterThan(0);
    await expect(measurements()).toEqual(before);
    await userEvent.keyboard('{Escape}');

    scroller.scrollTop = 0;
    first.scrollIntoView({ block: 'nearest' });
    const beforeTop = measurements();
    await userEvent.click(first);
    await waitFor(() => {
      expect(body.getByRole('listbox').getBoundingClientRect().top).toBeGreaterThanOrEqual(
        first.getBoundingClientRect().bottom
      );
      expect(measurements()).toEqual(beforeTop);
    });
    await userEvent.keyboard('{Escape}');

    scroller.scrollTop = scroller.scrollHeight;
    last.scrollIntoView({ block: 'nearest' });
    await userEvent.click(last);
    await waitFor(() => {
      expect(body.getByRole('listbox').getBoundingClientRect().bottom).toBeLessThanOrEqual(
        last.getBoundingClientRect().top
      );
    });
  },
};

export const ViewportBottom: Story = {
  ...ScrollableTable,
  render: () => <SelectTable constrained={false} />,
};

export const RegionalTheme: Story = {
  ...ScrollableTable,
  render: () => (
    <section
      data-theme="dark"
      data-testid="select-theme-region"
      style={{
        background: 'var(--color-select-background)',
        color: 'var(--color-text-on-light-primary)',
      }}
    >
      <link rel="stylesheet" href="/startribune-dark.scoped.css" />
      <SelectTable />
    </section>
  ),
  play: async (context) => {
    await ScrollableTable.play?.(context);
    const region = context.canvas.getByTestId('select-theme-region');
    const menu = within(region).getByRole('listbox');
    await waitFor(() => {
      expect(getComputedStyle(menu).backgroundColor).toBe(getComputedStyle(region).backgroundColor);
      expect(getComputedStyle(menu).backgroundColor).not.toBe('rgb(255, 255, 255)');
    });
  },
};

export const NativeDialog: Story = {
  render: function Render() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [value, setValue] = useState('1');
    return (
      <>
        <button onClick={() => dialogRef.current?.showModal()}>Open dialog</button>
        <dialog ref={dialogRef} aria-label="Select example" style={{ width: 400, height: 450 }}>
          <button onClick={() => dialogRef.current?.close()}>Close dialog</button>
          <FormControl.Select
            id="native-dialog-select"
            options={OPTIONS}
            value={value}
            onChange={setValue}
          />
        </dialog>
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Open dialog' }));
    const dialog = canvas.getByRole('dialog', { name: 'Select example' });
    const trigger = within(dialog).getByRole('combobox');
    await userEvent.click(trigger);
    const option = await within(dialog).findByRole('option', { name: 'Option-2' });
    await waitFor(() => {
      const rect = option.getBoundingClientRect();
      const target = dialog.ownerDocument.elementFromPoint(
        rect.x + rect.width / 2,
        rect.y + rect.height / 2
      );
      expect(option.contains(target)).toBe(true);
    });
    await userEvent.click(option);
    await expect(trigger).toHaveTextContent('Option-2');
    await expect(trigger).toHaveFocus();
    await expect(within(dialog).queryByRole('listbox')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await expect(await within(dialog).findByRole('listbox')).toBeVisible();
  },
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

        {/* Reserves room for the open dropdown in the visual overview. */}
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
  // Chromatic snapshots after play completes, so the open dropdown is captured
  play: async ({ canvas, userEvent }) => {
    // findBy waits out the decorator's async theme load
    const select = await canvas.findByTestId('select-open');
    await userEvent.click(select);
    await expect(await within(select.ownerDocument.body).findByRole('listbox')).toBeVisible();
  },
};
