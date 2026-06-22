import React, { useEffect, useMemo, useState } from 'react';
import { Animated, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { useNativeStyles } from '@/hooks/useNativeStyles';
import type { SkeletonNativeProps } from '../Skeleton.types';
import { createSkeletonStyles } from './Skeleton.styles';

export const Skeleton: React.FC<SkeletonNativeProps> = ({
  variant = 'rectangle',
  animate = true,
  width,
  height,
  dataTestId = 'skeleton',
  style,
  'aria-hidden': ariaHidden = true,
  ...accessibilityProps
}) => {
  const [elementWidth, setElementWidth] = useState(0);
  const [shimmerAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!animate || elementWidth === 0) {
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
  }, [animate, elementWidth, shimmerAnim]);

  const translateX = useMemo(
    () =>
      shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-elementWidth, elementWidth],
      }),
    [shimmerAnim, elementWidth]
  );

  const styles = useNativeStyles((theme) => createSkeletonStyles(theme, variant));

  const overrideStyle: ViewStyle = {
    ...(width !== undefined ? { width: width as ViewStyle['width'] } : undefined),
    ...(height !== undefined ? { height: height as ViewStyle['height'] } : undefined),
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    setElementWidth(e.nativeEvent.layout.width);
  };

  return (
    <Animated.View
      testID={dataTestId}
      accessibilityElementsHidden={ariaHidden ?? true}
      importantForAccessibility="no-hide-descendants"
      style={[styles.root, overrideStyle, style as StyleProp<ViewStyle>]}
      accessibilityLabel={accessibilityProps['aria-label']}
      onLayout={handleLayout}
    >
      {animate && elementWidth > 0 && (
        <Animated.View style={[styles.shimmer, { transform: [{ translateX }] }]} />
      )}
    </Animated.View>
  );
};

Skeleton.displayName = 'Skeleton';
