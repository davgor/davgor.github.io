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
    expect(screen.getByText(/modding in oblivion/i)).toBeInTheDocument();
    expect(screen.getByText(/paladin/i)).toBeInTheDocument();
    expect(screen.getByText(/Warhammer 40k/i)).toBeInTheDocument();
  });
});
