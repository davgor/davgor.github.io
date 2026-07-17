import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactMe from './ContactMe';

describe('ContactMe', () => {
  it('renders the contact title and intro', () => {
    render(<ContactMe />);
    expect(screen.getByText('Contact me!')).toBeInTheDocument();
    expect(screen.getByText(/open to hearing about new job opportunities/i)).toBeInTheDocument();
  });

  it('lists interview titles', () => {
    render(<ContactMe />);
    expect(screen.getByText(/Senior Software Developer In Test \(SDET\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Director of Quality Assurance/i)).toBeInTheDocument();
  });

  it('exposes contact methods including LinkedIn', () => {
    render(<ContactMe />);
    expect(screen.getByText(/515-864-6382/)).toBeInTheDocument();
    expect(screen.getByText(/davgor4@gmail.com/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'linkedin.com/in/davgor4/' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/davgor4/'
    );
  });
});
