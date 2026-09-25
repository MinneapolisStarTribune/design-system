import { parsePianoCoachmarkResponseVariables } from './parsePianoCoachmarkResponseVariables';

const REQUIRED_FIELDS = {
  id: 'gift-top',
  title: 'You have a gift',
  description: 'Someone shared this article with you.',
  ctaText: 'Create Free Account',
  ctaType: 'signup',
};

describe('parsePianoCoachmarkResponseVariables', () => {
  it('returns the id/payload pair when all required fields are present', () => {
    expect(parsePianoCoachmarkResponseVariables(REQUIRED_FIELDS)).toEqual({
      id: 'gift-top',
      payload: {
        title: REQUIRED_FIELDS.title,
        description: REQUIRED_FIELDS.description,
        ctaText: REQUIRED_FIELDS.ctaText,
        ctaType: REQUIRED_FIELDS.ctaType,
        icon: undefined,
        position: 'bottom',
        align: 'center',
        dismissOnOutsideClick: false,
        showLogin: false,
      },
    });
  });

  it('resolves icon via the provided resolveIcon callback', () => {
    const resolveIcon = vi.fn((name?: string) => `resolved:${name}`);

    const parsed = parsePianoCoachmarkResponseVariables(
      { ...REQUIRED_FIELDS, icon: 'gift' },
      { resolveIcon }
    );

    expect(resolveIcon).toHaveBeenCalledWith('gift');
    expect(parsed?.payload.icon).toBe('resolved:gift');
  });

  it('omits badgeText when not given', () => {
    expect(
      parsePianoCoachmarkResponseVariables(REQUIRED_FIELDS)?.payload.badgeText
    ).toBeUndefined();
  });

  it('passes badgeText through unchanged when given', () => {
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, badgeText: 'New' })?.payload
        .badgeText
    ).toBe('New');
  });

  it('defaults position to bottom when omitted or unrecognized', () => {
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, position: 'sideways' })?.payload
        .position
    ).toBe('bottom');
    expect(parsePianoCoachmarkResponseVariables(REQUIRED_FIELDS)?.payload.position).toBe('bottom');
  });

  it.each(['top', 'center'] as const)('passes position through as %s when given', (position) => {
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, position })?.payload.position
    ).toBe(position);
  });

  it('defaults align to center when omitted or unrecognized', () => {
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, align: 'sideways' })?.payload.align
    ).toBe('center');
    expect(parsePianoCoachmarkResponseVariables(REQUIRED_FIELDS)?.payload.align).toBe('center');
  });

  it.each(['left', 'right'] as const)('passes align through as %s when given', (align) => {
    expect(parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, align })?.payload.align).toBe(
      align
    );
  });

  it('coerces dismissOnOutsideClick to a strict boolean', () => {
    expect(
      parsePianoCoachmarkResponseVariables(REQUIRED_FIELDS)?.payload.dismissOnOutsideClick
    ).toBe(false);
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, dismissOnOutsideClick: true })
        ?.payload.dismissOnOutsideClick
    ).toBe(true);
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, dismissOnOutsideClick: false })
        ?.payload.dismissOnOutsideClick
    ).toBe(false);
  });

  it('coerces showLogin to a strict boolean, defaulting to false when omitted', () => {
    expect(parsePianoCoachmarkResponseVariables(REQUIRED_FIELDS)?.payload.showLogin).toBe(false);
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, showLogin: true })?.payload
        .showLogin
    ).toBe(true);
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, showLogin: false })?.payload
        .showLogin
    ).toBe(false);
  });

  it('passes ctaType through unchanged, even for a value with no known meaning here', () => {
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, ctaType: 'favorite' })?.payload
        .ctaType
    ).toBe('favorite');
  });

  it.each(['id', 'title', 'description', 'ctaText', 'ctaType'] as const)(
    'returns null when %s is missing',
    (field) => {
      const { [field]: _omit, ...rest } = REQUIRED_FIELDS;

      expect(parsePianoCoachmarkResponseVariables(rest)).toBeNull();
    }
  );

  it('returns null for an unrelated response-variable event (e.g. the call-to-action banner)', () => {
    expect(
      parsePianoCoachmarkResponseVariables({
        // No id/title/description/ctaText/ctaType at all -- as when Piano fires
        // setResponseVariable for an unrelated feature.
      })
    ).toBeNull();
  });
});
