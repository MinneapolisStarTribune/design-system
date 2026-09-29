import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import axeCore from 'axe-core';
import { Drawer } from './Drawer';
import { DRAWER_POSITIONS } from './Drawer.types';
import { Button, FormControl, FormGroup, UtilityBody } from '@/components/index.web';
import { DesignSystemProvider } from '@/providers/DesignSystemProvider';

// The drawer portals into `body`, so scan `body` rather than the render container, excluding
// Floating UI's focus guards. Open via `open` so no focusable trigger is left under aria-hidden.
const renderOpenDrawerAndCheckA11y = async (ui: React.ReactElement) => {
  render(
    <DesignSystemProvider brand="startribune" forceColorScheme="light">
      {ui}
    </DesignSystemProvider>
  );

  await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

  const results = await axeCore.run({
    include: [['body']],
    exclude: [['[data-floating-ui-focus-guard]']],
  });

  expect(results).toHaveNoViolations();
};

const noop = () => {};

describe('Drawer Accessibility', () => {
  it.each(DRAWER_POSITIONS)('has no violations in the %s position', async (position) => {
    await renderOpenDrawerAndCheckA11y(
      <Drawer open onClose={noop} position={position}>
        <Drawer.Heading>Filter calendar</Drawer.Heading>

        <Drawer.Description>Narrow the games shown on the calendar.</Drawer.Description>

        <Drawer.Body>
          <UtilityBody size="small">Filter content.</UtilityBody>
        </Drawer.Body>

        <Drawer.Footer>
          <Button variant="outlined">Clear all</Button>
          <Button color="brand">Show 999 athletes</Button>
        </Drawer.Footer>
      </Drawer>
    );
  });

  it('has no violations for a drawer named by aria-label', async () => {
    await renderOpenDrawerAndCheckA11y(
      <Drawer open onClose={noop} aria-label="Game details">
        <Drawer.Body>
          <UtilityBody size="small">Content without a visible title.</UtilityBody>
        </Drawer.Body>
      </Drawer>
    );
  });

  it('has no violations without the close button', async () => {
    await renderOpenDrawerAndCheckA11y(
      <Drawer open onClose={noop} isDismissable={false} showCloseButton={false}>
        <Drawer.Heading>Finish setting up your team</Drawer.Heading>

        <Drawer.Footer>
          <Button color="brand">Continue</Button>
        </Drawer.Footer>
      </Drawer>
    );
  });

  it('has no violations for a filter form', async () => {
    await renderOpenDrawerAndCheckA11y(
      <Drawer open onClose={noop}>
        <Drawer.Heading>Filter calendar</Drawer.Heading>

        <Drawer.Body>
          <FormGroup>
            <FormGroup.Label>Game type</FormGroup.Label>
            <FormControl.CheckboxGroup
              value={['tournament']}
              onChange={noop}
              options={[
                { value: 'regular-season', title: 'Regular season' },
                { value: 'tournament', title: 'Tournament' },
              ]}
            />
          </FormGroup>

          <FormGroup>
            <FormGroup.Label>Timeframe</FormGroup.Label>
            <FormControl.CheckboxGroup
              value={[]}
              onChange={noop}
              options={[
                { value: 'morning', title: 'Morning', description: '8am – 1pm' },
                { value: 'afternoon', title: 'Afternoon', description: '1pm – 6pm' },
              ]}
            />
          </FormGroup>
        </Drawer.Body>

        <Drawer.Footer>
          <Button variant="outlined">Clear all</Button>
          <Button color="brand">Show 999 athletes</Button>
        </Drawer.Footer>
      </Drawer>
    );
  });
});
