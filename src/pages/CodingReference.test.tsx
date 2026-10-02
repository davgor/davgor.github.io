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

  it('renders portfolio, Electron Server Manager, AI-DND-Matrix, and BoosterSeat project cards', () => {
    render(<CodingReference />);
    expect(screen.getByText('davgor.github.io')).toBeInTheDocument();
    expect(screen.getByText('Electron Server Manager')).toBeInTheDocument();
    expect(screen.getByText('AI-DND-Matrix')).toBeInTheDocument();
    expect(screen.getByText('BoosterSeat')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/davgor.github.io' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/ElectronServerManager' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/AI-DND-Matrix' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/BoosterSeat' })
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

  it('describes BoosterSeat as a quick-start app template', () => {
    render(<CodingReference />);
    expect(screen.getByText(/quick-start template/i)).toBeInTheDocument();
    expect(screen.getByText(/Vite \+ React \+ TypeScript CRUD scaffold/i)).toBeInTheDocument();
    expect(screen.getByText(/fireguard grading on new tests/i)).toBeInTheDocument();
    expect(screen.getByText(/board tickets/i)).toBeInTheDocument();
    expect(screen.getByText(/red-team review/i)).toBeInTheDocument();
    expect(screen.getByText(/GitHub Pages via Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/Electron conversion/i)).toBeInTheDocument();
  });

  it('renders a Dark Mechanicus card linking to the repository and latest release', () => {
    render(<CodingReference />);
    expect(screen.getByRole('heading', { name: 'Dark Mechanicus' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/DarkMechanicus' })
    ).toHaveAttribute('href', 'https://github.com/davgor/DarkMechanicus');
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/DarkMechanicus/releases/latest' })
    ).toHaveAttribute('href', 'https://github.com/davgor/DarkMechanicus/releases/latest');
  });

  it('describes Dark Mechanicus as an MCP server and desktop app on shared repository-owned state', () => {
    render(<CodingReference />);
    expect(
      screen.getByText(/local planning and execution coordination tool for agentic development/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/an MCP server for agents and an Electron desktop app for people/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/same repository-owned state under the same rules/i)
    ).toBeInTheDocument();
  });

  it('describes the draft, Save, orchestrated run, and human-approved sprint checkpoint flow', () => {
    render(<CodingReference />);
    expect(screen.getByText(/writes the plan as a draft/i)).toBeInTheDocument();
    expect(screen.getByText(/the saved plan only changes on Save/i)).toBeInTheDocument();
    expect(
      screen.getByText(/orchestrator agent then runs that saved revision/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/claims ready tickets for its own workers/i)).toBeInTheDocument();
    expect(
      screen.getByText(/stops at each sprint checkpoint until I approve/i)
    ).toBeInTheDocument();
  });

  it('explains the Dark Mechanicus design choices: enforced rules, fixed roles, Git-tracked plans', () => {
    render(<CodingReference />);
    expect(screen.getByText(/the server enforces the rules/i)).toBeInTheDocument();
    expect(screen.getByText(/roles are fixed at launch/i)).toBeInTheDocument();
    expect(screen.getByText(/Git-tracked JSON under \.darkmechanicus\//)).toBeInTheDocument();
    expect(screen.getByText(/SQLite working database stays local/i)).toBeInTheDocument();
    expect(screen.getByText(/plan and execute with the desktop closed/i)).toBeInTheDocument();
  });

  it('lists the Dark Mechanicus stack and Windows and macOS release flow', () => {
    render(<CodingReference />);
    expect(screen.getByText(/built-in node:sqlite/i)).toBeInTheDocument();
    expect(
      screen.getByText(/MCP SDK provides the stdio server, React Flow draws the plan graph/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/packages builds for Windows and macOS/i)).toBeInTheDocument();
    expect(
      screen.getByText(/in-app updates come from there through electron-updater/i)
    ).toBeInTheDocument();
  });

  it('places the Dark Mechanicus card directly after the world showcase and before the site card', () => {
    render(<CodingReference />);
    const showcase = screen.getByRole('heading', {
      name: 'Fantasy World Generator — World Showcase',
    });
    const card = screen.getByRole('heading', { name: 'Dark Mechanicus' });
    const siteCard = screen.getByRole('heading', { name: 'davgor.github.io' });
    expect(showcase.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(card.compareDocumentPosition(siteCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const cards = screen.getAllByTestId('content-card');
    expect(cards[1]).toContainElement(card);
    expect(cards[2]).toContainElement(siteCard);
  });

  it('uses correct grammar in project descriptions', () => {
    render(<CodingReference />);
    expect(screen.getByText(/check out my GitHub page/i)).toBeInTheDocument();
    expect(screen.getByText(/more in-depth information/i)).toBeInTheDocument();
    expect(screen.getByText(/It's a pretty simple page/i)).toBeInTheDocument();
  });
  it('embeds the static showcase with restricted permissions and a safe full-window link', () => {
    render(<CodingReference />);
    const viewer = screen.getByTitle('MathLab world showcase');
    expect(viewer).toHaveAttribute('src', '/mathlab/index.html');
    expect(viewer).toHaveAttribute('loading', 'lazy');
    expect(viewer).toHaveAttribute(
      'sandbox',
      'allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox'
    );
    expect(screen.getByRole('link', { name: 'Fantasy World Generator source' })).toHaveAttribute(
      'href',
      'https://github.com/davgor/FantasyWorldGenerator'
    );
    expect(
      screen.getByRole('heading', { name: 'Fantasy World Generator — World Showcase' })
    ).toBeVisible();
    const fullWindow = screen.getByRole('link', { name: 'Open showcase in a full window' });
    expect(fullWindow).toHaveAttribute('href', '/mathlab/');
    expect(fullWindow).toHaveAttribute('target', '_blank');
    expect(fullWindow).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
