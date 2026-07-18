import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hobbies from './Hobbies';

describe('Hobbies', () => {
  it('renders gaming, DND, and Warhammer cards', () => {
    render(<Hobbies />);
    expect(screen.getByText('Gaming')).toBeInTheDocument();
    expect(screen.getByText('Dungeons and Dragons')).toBeInTheDocument();
    expect(screen.getByText('Warhammer, and miniature painting')).toBeInTheDocument();
  });

  it('linkifies the Instagram miniatures URL', () => {
    render(<Hobbies />);
    expect(
      screen.getByRole('link', { name: 'https://www.instagram.com/gordenminiatures/' })
    ).toHaveAttribute('href', 'https://www.instagram.com/gordenminiatures/');
  });

  it('mentions key hobby details', () => {
    render(<Hobbies />);
    expect(screen.getByText(/modding in Oblivion/i)).toBeInTheDocument();
    expect(screen.getByText(/paladin/i)).toBeInTheDocument();
    expect(screen.getByText(/Warhammer 40k/i)).toBeInTheDocument();
  });

  it('uses correct spelling and proper nouns in hobby copy', () => {
    render(<Hobbies />);
    expect(screen.getByText(/could lose time over modding/i)).toBeInTheDocument();
    expect(screen.getByText(/even arguably I spent more time/i)).toBeInTheDocument();
    expect(screen.getByText(/Creation Kit than I ever did/i)).toBeInTheDocument();
    expect(screen.getByText(/Lethal Company/i)).toBeInTheDocument();
    expect(screen.getByText(/Helldivers/i)).toBeInTheDocument();
    expect(screen.getByText(/Dragon's Dogma/i)).toBeInTheDocument();
    expect(screen.getByText(/in between Magic: The Gathering/i)).toBeInTheDocument();
    expect(screen.getByText(/quite a lot of Warhammer 40k/i)).toBeInTheDocument();
    expect(screen.getByText(/my Instagram link/i)).toBeInTheDocument();
  });
});
