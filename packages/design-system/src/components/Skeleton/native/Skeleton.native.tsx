import React, { useEffect, useMemo, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useNativeStyles } from '@/hooks/useNativeStyles';
import type { SkeletonNativeProps } from '../Skeleton.types';
import { resolveSkeletonDimensions } from '../resolveSkeletonDimensions';
import { createSkeletonStyles } from './Skeleton.styles';

export const Skeleton: React.FC<SkeletonNativeProps> = ({
  variant = 'rectangle',
  surface,
  animate = true,
  width,
  height,
  radius,
  dataTestId = 'skeleton',
  style,
  'aria-hidden': ariaHidden = true,
  ...accessibilityProps
}) => {
  const [elementWidth, setElementWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [shimmerAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const shouldAnimate = animate && !reduceMotion;

  useEffect(() => {
    if (!shouldAnimate || elementWidth === 0) {
      shimmerAnim.setValue(0);
      return;
    }

    const anim = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );

    anim.start();
    return () => anim.stop();
  }, [shouldAnimate, elementWidth, shimmerAnim]);

  const translateX = useMemo(
    () =>
      shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-elementWidth, elementWidth],
      }),
    [shimmerAnim, elementWidth]
  );

  const styles = useNativeStyles((theme) => createSkeletonStyles(theme, variant, surface));

  const overrideStyle = resolveSkeletonDimensions(variant, width, height) as ViewStyle;

  const handleLayout = (e: LayoutChangeEvent) => {
    setElementWidth(e.nativeEvent.layout.width);
  };

  return (
    <Animated.View
      testID={dataTestId}
      accessibilityElementsHidden={ariaHidden ?? true}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.root,
        overrideStyle,
        radius !== undefined && { borderRadius: radius },
        style as StyleProp<ViewStyle>,
      ]}
      accessibilityLabel={accessibilityProps['aria-label']}
      onLayout={handleLayout}
    >
      {shouldAnimate && elementWidth > 0 && (
        <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]} />
      )}
    </Animated.View>
  );
};

Skeleton.displayName = 'Skeleton';
