import { isValidElement } from 'react';

import RootLayout from './layout';

describe('RootLayout', () => {
  it('raises the root font size for readability', () => {
    const tree = RootLayout({ children: <div /> });

    expect(isValidElement(tree)).toBe(true);
    expect(tree.props.style?.fontSize).toBe('17px');
  });
});
