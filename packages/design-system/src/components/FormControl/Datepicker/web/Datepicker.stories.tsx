import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { FormControl } from '../../FormControl';
import { FormGroup } from '@/components/FormGroup/web/FormGroup';

const meta = {
  title: 'Forms/FormControl/Datepicker',
  component: FormControl.Datepicker,
  parameters: { layout: 'centered', a11y: { test: 'error' } },
  decorators: [
    (Story) => (
      <div style={{ width: 288, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  args: { size: 'medium', placeholderText: 'Select date...', calendarLabel: 'Choose a date' },
  argTypes: { size: { control: 'select', options: ['small', 'medium', 'large'] } },
} satisfies Meta<typeof FormControl.Datepicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Configurable: Story = {
  render: (args) => (
    <FormGroup>
      <FormGroup.Label>Date</FormGroup.Label>
      <FormControl.Datepicker {...args} />
    </FormGroup>
  ),
};

export const KeyboardSelection: Story = {
  render: (args) => (
    <FormGroup>
      <FormGroup.Label>Date</FormGroup.Label>
      <FormControl.Datepicker {...args} defaultValue="2026-04-18" />
    </FormGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const trigger = await canvas.findByRole('button', { name: 'Choose a date' });
    await userEvent.click(trigger);
    const dialog = await page.findByRole('dialog');
    await expect(
      within(dialog).getByRole('button', { name: 'Saturday, April 18, 2026' })
    ).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(canvas.getByRole('textbox')).toHaveValue('April 19, 2026');
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.click(trigger);
    await userEvent.keyboard('{Escape}');
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
export const DateLimits: Story = {
  render: (args) => (
    <FormGroup>
      <FormGroup.Label>Date</FormGroup.Label>
      <FormGroup.Description>Choose April 18–20, 2026.</FormGroup.Description>
      <FormControl.Datepicker
        {...args}
        min="2026-04-18"
        max="2026-04-20"
        defaultValue="2026-04-18"
      />
    </FormGroup>
  ),
};
export const SizesAndStates: Story = {
  play: async ({ canvasElement }) => {
    const inputs = await within(canvasElement).findAllByRole('textbox');
    for (const input of inputs) {
      const trigger = input.parentElement?.parentElement?.querySelector('button');
      if (!trigger) throw new Error('Missing calendar action');
      await expect(input.getBoundingClientRect().right).toBeLessThanOrEqual(
        trigger.getBoundingClientRect().left
      );
    }
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <FormGroup key={size}>
          <FormGroup.Label>{size}</FormGroup.Label>
          <FormControl.Datepicker size={size} />
        </FormGroup>
      ))}
      <FormGroup>
        <FormGroup.Label>Rounded</FormGroup.Label>
        <FormControl.Datepicker rounded defaultValue="2026-04-18" />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Disabled</FormGroup.Label>
        <FormControl.Datepicker isDisabled defaultValue="2026-04-18" />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Read only</FormGroup.Label>
        <FormControl.Datepicker readOnly defaultValue="2026-04-18" />
      </FormGroup>
      <FormGroup>
        <FormGroup.Label>Date</FormGroup.Label>
        <FormControl.Datepicker placeholderText="Placeholder text..." />
        <FormGroup.Caption variant="error">
          Games cannot be scheduled in the past.
        </FormGroup.Caption>
      </FormGroup>
    </div>
  ),
};
