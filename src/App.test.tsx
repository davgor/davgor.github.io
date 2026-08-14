import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App, { AppRoutes } from './App';
import { renderWithRouter } from './test/renderWithRouter';
import { jobs } from './data/jobs';

describe('App', () => {
  it('boots BrowserRouter without legacy v6 future flags and shows About Me', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByText('David Gorden - 9+ years experience')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About Me/i })).toHaveAttribute('aria-current', 'page');
  });
});

describe('AppRoutes', () => {
  it('renders About Me on the home route', () => {
    renderWithRouter(<AppRoutes />, { route: '/' });
    expect(screen.getByText('David Gorden - 9+ years experience')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About Me/i })).toHaveAttribute('aria-current', 'page');
  });

  it('renders Experience on /experience', () => {
    renderWithRouter(<AppRoutes />, { route: '/experience' });
    expect(screen.getByTestId(`job-card-${jobs[0].id}`)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Experience/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
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
