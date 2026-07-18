import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CodingReference from './CodingReference';

describe('CodingReference', () => {
  it('renders intro card with GitHub profile link', () => {
    render(<CodingReference />);
    expect(screen.getByText('Coding Reference')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://github.com/davgor' })).toHaveAttribute(
      'href',
      'https://github.com/davgor'
    );
  });

  it('renders portfolio and Electron Server Manager project cards', () => {
    render(<CodingReference />);
    expect(screen.getByText('davgor.github.io')).toBeInTheDocument();
    expect(screen.getByText('Electron Server Manager')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/davgor.github.io' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/ElectronServerManager' })
    ).toBeInTheDocument();
  });

  it('renders the server manager screenshot', () => {
    render(<CodingReference />);
    expect(screen.getByAltText('App screenshot')).toHaveAttribute(
      'src',
      '/assets/Server_manager.png'
    );
  });

  it('uses correct grammar in project descriptions', () => {
    render(<CodingReference />);
    expect(screen.getByText(/check out my GitHub page/i)).toBeInTheDocument();
    expect(screen.getByText(/more in-depth information/i)).toBeInTheDocument();
    expect(screen.getByText(/It's a pretty simple page/i)).toBeInTheDocument();
    expect(screen.getByText(/local use case has me doing it on Windows/i)).toBeInTheDocument();
  });
});
