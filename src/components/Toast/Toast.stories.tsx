import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toast, TOAST_VARIANTS } from './Toast';
import type { ToastProps } from './Toast';

const meta = {
  title: 'Feedback & Status/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [...TOAST_VARIANTS],
    },
    showIcon: {
      control: 'boolean',
    },
    onClose: {
      action: 'onClose',
      description: 'Called when the close button is clicked',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

// Wrapper so the toast can be dismissed and shown again (Storybook doesn't pass functions in args).
function ToastWithClose(props: ToastProps) {
  const [open, setOpen] = useState(true);
  const { onClose: _onClose, ...toastProps } = props;
  return (
    <React.Fragment>
      {open ? (
        <Toast {...toastProps} onClose={() => setOpen(false)} />
      ) : (
        <button type="button" onClick={() => setOpen(true)}>
          Show toast again
        </button>
      )}
    </React.Fragment>
  );
}

const renderWithClose = (args: ToastProps) => <ToastWithClose {...args} />;

export const Default: Story = {
  args: {
    title: 'Update saved',
    description: 'Your changes have been saved.',
    variant: 'info',
    showIcon: true,
    onClose: () => {},
    dataTestId: 'toast-demo',
  },
  render: renderWithClose,
};

export const TitleOnly: Story = {
  args: {
    title: 'Title only',
    variant: 'info',
    showIcon: true,
    onClose: () => {},
  },
  render: renderWithClose,
};

export const WithoutIcon: Story = {
  args: {
    title: 'No icon',
    description: 'Toast with showIcon set to false.',
    showIcon: false,
    variant: 'info',
    onClose: () => {},
  },
  render: renderWithClose,
};

export const Info: Story = {
  args: {
    title: 'Information',
    description: 'This is an info toast.',
    variant: 'info',
    onClose: () => {},
  },
  render: renderWithClose,
};

export const Success: Story = {
  args: {
    title: 'Success',
    description: 'Your profile was updated.',
    variant: 'success',
    onClose: () => {},
  },
  render: renderWithClose,
};

export const Warning: Story = {
  args: {
    title: 'Warning',
    description: 'Your session will expire in 5 minutes.',
    variant: 'warning',
    onClose: () => {},
  },
  render: renderWithClose,
};

export const Error: Story = {
  args: {
    title: 'Error',
    description: 'Something went wrong. Please try again.',
    variant: 'error',
    onClose: () => {},
  },
  render: renderWithClose,
};
