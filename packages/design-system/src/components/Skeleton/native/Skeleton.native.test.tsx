import { AccessibilityInfo } from 'react-native';
import { act, render, screen } from '@testing-library/react-native';
import { TestWrapperInDesignSystemProvider } from '@/test-utils/wrappers';
import { Skeleton } from './Skeleton.native';

const setReduceMotion = (enabled: boolean) =>
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(enabled);

const renderSkeleton = async (props: Parameters<typeof Skeleton>[0] = {}) => {
  render(<Skeleton {...props} />, { wrapper: TestWrapperInDesignSystemProvider() });
  // Flush the async reduce motion lookup.
  await act(async () => {});
  // Skeletons are hidden from assistive tech, so queries must include hidden elements.
  const root = screen.getByTestId('skeleton', { includeHiddenElements: true });
  await act(async () => {
    root.props.onLayout({ nativeEvent: { layout: { width: 100 } } });
  });
  return root;
};

describe('Skeleton (native)', () => {
  afterEach(() => jest.restoreAllMocks());

  it('applies radius as borderRadius', async () => {
    setReduceMotion(false);
    const root = await renderSkeleton({ radius: 12 });
    expect(JSON.stringify(root.props.style)).toContain('"borderRadius":12');
  });

  it('uses the dark palette for the dark surface', async () => {
    setReduceMotion(false);
    const root = await renderSkeleton({ surface: 'dark' });
    expect(JSON.stringify(root.props.style)).toContain('#45474A');
  });

  it('uses the light palette for the light surface', async () => {
    setReduceMotion(false);
    const root = await renderSkeleton({ surface: 'light' });
    expect(JSON.stringify(root.props.style)).toContain('#E3E5E8');
  });

  it('renders the shimmer when reduce motion is off', async () => {
    setReduceMotion(false);
    const root = await renderSkeleton();
    expect(root.children.length).toBe(1);
  });

  it('skips the shimmer when reduce motion is on', async () => {
    setReduceMotion(true);
    const root = await renderSkeleton();
    expect(root.children.length).toBe(0);
  });
});
