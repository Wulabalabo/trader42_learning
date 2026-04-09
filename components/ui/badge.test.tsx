import { render, screen } from '@testing-library/react';

import { Badge } from './badge';

describe('Badge', () => {
  it('uses a larger readable font size', () => {
    render(<Badge variant="gold">高</Badge>);

    expect(screen.getByText('高').className).toContain('text-[11px]');
  });
});
