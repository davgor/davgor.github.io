import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { AppRoutes } from './App';
import { renderWithRouter } from './test/renderWithRouter';
import { jobs } from './data/jobs';

describe('AppRoutes', () => {
  it('renders About Me on the home route', () => {
    renderWithRouter(<AppRoutes />, { route: '/' });
    expect(screen.getByText('David Gorden - 9+ years experience')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About Me/i })).toHaveClass('active');
  });

  it('renders Experience on /experience', () => {
    renderWithRouter(<AppRoutes />, { route: '/experience' });
    expect(screen.getByTestId(`job-card-${jobs[0].id}`)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Experience/i })).toHaveClass('active');
  });

  it('renders Coding Reference on /coding-reference', () => {
    renderWithRouter(<AppRoutes />, { route: '/coding-reference' });
    expect(screen.getByText('Electron Server Manager')).toBeInTheDocument();
  });

  it('renders Dogs on /dogs', () => {
    renderWithRouter(<AppRoutes />, { route: '/dogs' });
    expect(screen.getByText('My Dogs')).toBeInTheDocument();
  });

  it('renders Hobbies on /hobbies', () => {
    renderWithRouter(<AppRoutes />, { route: '/hobbies' });
    expect(screen.getByText('Gaming')).toBeInTheDocument();
  });

  it('renders Contact Me on /contact', () => {
    renderWithRouter(<AppRoutes />, { route: '/contact' });
    expect(screen.getByText('Contact me!')).toBeInTheDocument();
  });
});
