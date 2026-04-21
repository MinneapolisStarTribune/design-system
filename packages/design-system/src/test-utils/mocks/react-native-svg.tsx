import React from 'react';
import { View } from 'react-native';

type SvgMockProps = React.ComponentProps<typeof View> & {
  children?: React.ReactNode;
};

const createSvgMockComponent = (displayName: string) => {
  const MockComponent = React.forwardRef<View, SvgMockProps>(({ children, ...props }, ref) => (
    <View ref={ref} {...props}>
      {children}
    </View>
  ));

  MockComponent.displayName = displayName;

  return MockComponent;
};

const Svg = createSvgMockComponent('Svg');

export const Path = createSvgMockComponent('Path');
export const SvgXml = createSvgMockComponent('SvgXml');

export default Svg;
