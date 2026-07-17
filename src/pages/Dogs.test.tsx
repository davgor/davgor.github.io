import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dogs from './Dogs';

describe('Dogs', () => {
  it('renders the intro card', () => {
    render(<Dogs />);
    expect(screen.getByText('My Dogs')).toBeInTheDocument();
    expect(screen.getByText(/3 dogs/i)).toBeInTheDocument();
  });

  it('renders a card for each dog with photo and breed', () => {
    render(<Dogs />);

    expect(screen.getByText(/Lestat, our little old man/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Lestat, our little old man/i)).toHaveAttribute(
      'src',
      '/assets/lestat.jpg'
    );
    expect(screen.getByText('German Shepard, terrier mix')).toBeInTheDocument();

    expect(screen.getByText(/Bilbo, our middle pup man/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Bilbo, our middle pup man/i)).toHaveAttribute(
      'src',
      '/assets/bilbo.jpg'
    );
    expect(screen.getByText('Greyhound, Beagle mix')).toBeInTheDocument();

    expect(screen.getByText(/Dorian, our youngest pup/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Dorian, our youngest pup/i)).toHaveAttribute(
      'src',
      '/assets/dorian.jpg'
    );
    expect(screen.getByText('Malenois, Pit mix')).toBeInTheDocument();
  });
});
