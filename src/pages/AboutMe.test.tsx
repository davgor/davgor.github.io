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

  it('uses correct grammar in the biography', () => {
    render(<AboutMe />);
    expect(screen.getByText(/consistently risen to the challenges/i)).toBeInTheDocument();
    expect(screen.getByText(/background as to who I am/i)).toBeInTheDocument();
    expect(screen.getByText(/went into the army when I was 20/i)).toBeInTheDocument();
    expect(screen.getByText(/modding Oblivion/i)).toBeInTheDocument();
    expect(screen.getByText(/associate's degree/i)).toBeInTheDocument();
  });
});
