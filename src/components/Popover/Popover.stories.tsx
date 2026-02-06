import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text, Stack, Box } from '@mantine/core';

import { Popover } from './Popover';
import { Button } from '../Button/Button';

import { POSITIONS } from '../../types/globalTypes';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],

  argTypes: {
    pointer: {
      control: 'select',
      options: POSITIONS,
      description: 'Pointer position',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

//
// Default
//
export const Default: Story = {
  render: () => (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        padding: '40px',
      }}
    >
      <Popover trigger={<Button label="Open" />} pointer="top">
        <Popover.Body>
          <Text size="sm">Basic popover content</Text>
        </Popover.Body>
      </Popover>
    </Box>
  ),
};

//
// With title
//
export const WithTitle: Story = {
  render: () => (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        padding: '40px',
        flexDirection: 'column',
      }}
    >
      <Popover trigger={<Button label="Open Popover" />} pointer="left">
        <Popover.Heading>Title</Popover.Heading>

        <Popover.Body>
          <Text size="sm">This is a popover, it is opened when button is clicked</Text>
        </Popover.Body>
      </Popover>
    </Box>
  ),
};

//
// With Header Divider
//
export const WithHeaderDivider: Story = {
  render: () => (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        padding: '40px',
      }}
    >
      <Popover trigger={<Button label="Open Popover" />} pointer="right">
        <Popover.Heading>Title</Popover.Heading>

        <Popover.Divider />

        <Popover.Body>
          <Text size="sm">This is a popover, it is opened when button is clicked</Text>
        </Popover.Body>
      </Popover>
    </Box>
  ),
};

//
// Scrollable
//
export const Scrollable: Story = {
  render: () => (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '600px',
        padding: '40px',
      }}
    >
      <Popover trigger={<Button label="Open Popover" />} pointer="left">
        <Popover.Heading>Items</Popover.Heading>

        <Popover.Divider />

        <Popover.Body>
          <Stack gap="xs">
            {Array.from({ length: 20 }).map((_, i) => (
              <Text key={i} size="sm">
                Item {i + 1}
              </Text>
            ))}
          </Stack>
        </Popover.Body>
      </Popover>
    </Box>
  ),
};

//
// Pointer positions - All directions
//
export const PointerPositions: Story = {
  render: () => (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '40px',
        minHeight: '600px',
        padding: '100px',
        alignItems: 'center',
        justifyItems: 'center',
      }}
    >
      {/* Top row - top pointer */}
      <div />
      <Popover pointer="top" trigger={<Button label="Top" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>
          <Text size="sm">This is a popover, it is opened when button is clicked</Text>
        </Popover.Body>
      </Popover>
      <div />

      {/* Middle row - left and right pointers */}
      <Popover pointer="left" trigger={<Button label="Left" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>
          <Text size="sm">This is a popover, it is opened when button is clicked</Text>
        </Popover.Body>
      </Popover>

      <div />

      <Popover pointer="right" trigger={<Button label="Right" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>
          <Text size="sm">This is a popover, it is opened when button is clicked</Text>
        </Popover.Body>
      </Popover>

      {/* Bottom row - bottom pointer */}
      <div />
      <Popover pointer="bottom" trigger={<Button label="Bottom" />}>
        <Popover.Heading>Title</Popover.Heading>
        <Popover.Body>
          <Text size="sm">This is a popover, it is opened when button is clicked</Text>
        </Popover.Body>
      </Popover>
      <div />
    </Box>
  ),
};

//
// Interactive States
//
export const InteractiveStates: Story = {
  render: () => (
    <Box
      style={{
        display: 'flex',
        gap: '80px',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        padding: '40px',
      }}
    >
      <Box>
        <Text size="sm" mb="md" c="dimmed">
          Default
        </Text>
        <Popover trigger={<Button label="Open Popover" />} pointer="top">
          <Popover.Heading>Title</Popover.Heading>
          <Popover.Body>
            <Text size="sm">This is a popover, it is opened when button is clicked</Text>
          </Popover.Body>
        </Popover>
      </Box>
    </Box>
  ),
};
