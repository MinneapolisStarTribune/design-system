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
        dismissOnOutsideClick: false,
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

  it('defaults position to bottom when omitted or unrecognized', () => {
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, position: 'sideways' })?.payload
        .position
    ).toBe('bottom');
    expect(parsePianoCoachmarkResponseVariables(REQUIRED_FIELDS)?.payload.position).toBe('bottom');
  });

  it('passes position through as top when given', () => {
    expect(
      parsePianoCoachmarkResponseVariables({ ...REQUIRED_FIELDS, position: 'top' })?.payload
        .position
    ).toBe('top');
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
