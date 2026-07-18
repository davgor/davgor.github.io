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

  it('renders portfolio, Electron Server Manager, and AI-DND-Matrix project cards', () => {
    render(<CodingReference />);
    expect(screen.getByText('davgor.github.io')).toBeInTheDocument();
    expect(screen.getByText('Electron Server Manager')).toBeInTheDocument();
    expect(screen.getByText('AI-DND-Matrix')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/davgor.github.io' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/ElectronServerManager' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/AI-DND-Matrix' })
    ).toBeInTheDocument();
  });

  it('renders the server manager screenshot', () => {
    render(<CodingReference />);
    expect(screen.getByAltText('App screenshot')).toHaveAttribute(
      'src',
      '/assets/Server_manager.png'
    );
  });

  it('describes current Electron Server Manager capabilities', () => {
    render(<CodingReference />);
    expect(
      screen.getByText(/scans Steam libraries for installed dedicated servers/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/REST admin panel and a live ops view/i)).toBeInTheDocument();
    expect(screen.getByText(/SteamCMD game-file updates/i)).toBeInTheDocument();
    expect(screen.getByText(/context isolation/i)).toBeInTheDocument();
    expect(screen.getByText(/check GitHub Releases for app auto-updates/i)).toBeInTheDocument();
  });

  it('describes AI-DND-Matrix as a dual-agent TTRPG desktop app', () => {
    render(<CodingReference />);
    expect(
      screen.getByText(/single-player, text-adventure-style TTRPG desktop app/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/DM agent that sets scenes/i)).toBeInTheDocument();
    expect(screen.getByText(/deterministic rules engine/i)).toBeInTheDocument();
    expect(screen.getByText(/re-grounded from SQLite/i)).toBeInTheDocument();
    expect(screen.getByText(/Claude by default, plus a local Player2 option/i)).toBeInTheDocument();
  });

  it('uses correct grammar in project descriptions', () => {
    render(<CodingReference />);
    expect(screen.getByText(/check out my GitHub page/i)).toBeInTheDocument();
    expect(screen.getByText(/more in-depth information/i)).toBeInTheDocument();
    expect(screen.getByText(/It's a pretty simple page/i)).toBeInTheDocument();
  });
});
