import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { AvatarIcon } from '@/icons';
import { allModes } from '@storybook-config/modes';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Actions/ButtonGroup',
  component: ButtonGroup,
};

export default meta;
type Story = StoryObj<typeof meta>;

const sectionTitleStyle: CSSProperties = {
  marginBottom: '1rem',
  fontSize: '14px',
  fontWeight: 600,
};

/**
 * Icon-only, text, and wrapping layouts in one canvas — used for Chromatic visual regression.
 */
export const AllVariants: Story = {
  parameters: {
    chromatic: { modes: allModes },
    controls: { disable: true },
    layout: 'fullscreen',
  },
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={sectionTitleStyle}>Icon buttons</h3>
        <ButtonGroup>
          <Button
            variant="outlined"
            color="neutral"
            size="medium"
            icon={<AvatarIcon />}
            aria-label="First icon button"
            onClick={() => undefined}
          />
          <Button
            variant="outlined"
            color="neutral"
            size="medium"
            icon={<AvatarIcon />}
            aria-label="Second icon button"
            onClick={() => undefined}
          />
          <Button
            variant="outlined"
            color="neutral"
            size="medium"
            icon={<AvatarIcon />}
            aria-label="Third icon button"
            onClick={() => undefined}
          />
        </ButtonGroup>
      </div>

      <div>
        <h3 style={sectionTitleStyle}>Text buttons (narrow container)</h3>
        <div style={{ maxWidth: 280 }}>
          <ButtonGroup>
            <Button variant="filled" color="brand" size="small" onClick={() => undefined}>
              One
            </Button>
            <Button variant="filled" color="brand" size="small" onClick={() => undefined}>
              Two
            </Button>
            <Button variant="filled" color="brand" size="small" onClick={() => undefined}>
              Three
            </Button>
            <Button variant="filled" color="brand" size="small" onClick={() => undefined}>
              Four
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <div>
        <h3 style={sectionTitleStyle}>Many buttons wrapping</h3>
        <div style={{ maxWidth: 380 }}>
          <ButtonGroup>
            {Array.from({ length: 20 }, (_, index) => (
              <Button
                key={index}
                variant="outlined"
                color="neutral"
                size="small"
                onClick={() => undefined}
              >
                Button {index + 1}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
    </div>
  ),
};
