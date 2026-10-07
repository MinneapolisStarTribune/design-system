import { useCoachmarkPortalRoot } from './useCoachmarkPortalRoot';

const ID = 'test-coachmark-portal';

afterEach(() => {
  document.getElementById(ID)?.remove();
});

describe('useCoachmarkPortalRoot', () => {
  it('creates a viewport-pinned, click-through node on first call', () => {
    const el = useCoachmarkPortalRoot(ID);

    expect(el?.isConnected).toBe(true);
    expect(el?.style.position).toBe('fixed');
    expect(el?.style.inset).toBe('0');
    expect(el?.style.pointerEvents).toBe('none');
  });

  it('returns the same node on a later call instead of creating a duplicate', () => {
    const first = useCoachmarkPortalRoot(ID);
    const second = useCoachmarkPortalRoot(ID);

    expect(second).toBe(first);
    expect(document.querySelectorAll(`#${ID}`)).toHaveLength(1);
  });

  it('re-applies styles to a stale node left over from an older version of this function', () => {
    // Mirrors a node created before position/pointer-events were added to this function (e.g. one
    // still sitting in the DOM across a dev server hot reload, since plain DOM nodes like this
    // aren't part of React's tree and so aren't touched by Fast Refresh).
    const stale = document.createElement('div');
    stale.id = ID;
    document.body.appendChild(stale);

    const el = useCoachmarkPortalRoot(ID);

    expect(el).toBe(stale);
    expect(el?.style.position).toBe('fixed');
    expect(el?.style.pointerEvents).toBe('none');
  });
});
