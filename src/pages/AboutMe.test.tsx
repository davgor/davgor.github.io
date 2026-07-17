import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AboutMe from './AboutMe';

describe('AboutMe', () => {
  it('renders the page title and photo', () => {
    render(<AboutMe />);
    expect(screen.getByText('David Gorden - 9+ years experience')).toBeInTheDocument();
    const photo = screen.getByAltText('David Gorden - 9+ years experience');
    expect(photo).toHaveAttribute('src', '/assets/fun_personal_photo.jpg');
    expect(photo).toHaveStyle({ objectPosition: 'left center' });
  });

  it('renders key biography content', () => {
    render(<AboutMe />);
    expect(screen.getByText(/engineer for over 9 years/i)).toBeInTheDocument();
    expect(screen.getByText(/Quality Engineering/i)).toBeInTheDocument();
    expect(screen.getByText(/Bilbo, Dorian, and Lestat/i)).toBeInTheDocument();
  });
});
