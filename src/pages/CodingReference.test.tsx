import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CodingReference from './CodingReference';

describe('CodingReference', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders intro card with GitHub profile link', () => {
    render(<CodingReference />);
    expect(screen.getByText('Coding Reference')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'https://github.com/davgor' })).toHaveAttribute(
      'href',
      'https://github.com/davgor'
    );
  });

  it('renders portfolio, Dark Mechanicus, Electron Server Manager, AI-DND-Matrix, and BoosterSeat project cards', () => {
    render(<CodingReference />);
    expect(screen.getByText('davgor.github.io')).toBeInTheDocument();
    expect(screen.getByText('Dark Mechanicus')).toBeInTheDocument();
    expect(screen.getByText('Electron Server Manager')).toBeInTheDocument();
    expect(screen.getByText('AI-DND-Matrix')).toBeInTheDocument();
    expect(screen.getByText('BoosterSeat')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/davgor.github.io' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'https://github.com/davgor/DarkMechanicus' })
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

  it('describes Dark Mechanicus as local planning and execution coordination for agentic development', () => {
    render(<CodingReference />);
    expect(screen.getByText(/I built Dark Mechanicus/i)).toBeInTheDocument();
    expect(
      screen.getByText(/MCP server for agents.*Electron desktop app for people/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/repository-owned state/i)).toBeInTheDocument();
    expect(screen.getByText(/I review the plan graph.*press Save/i)).toBeInTheDocument();
    expect(
      screen.getByText(/stops at every sprint checkpoint until I approve/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/roles are fixed when a session registers/i)).toBeInTheDocument();
    expect(screen.getByText(/\.darkmechanicus\//i)).toBeInTheDocument();
  });

  it('links Dark Mechanicus to GitHub repository and releases page', () => {
    render(<CodingReference />);
    const repoLink = screen.getByRole('link', { name: 'https://github.com/davgor/DarkMechanicus' });
    expect(repoLink).toHaveAttribute('href', 'https://github.com/davgor/DarkMechanicus');
    const releasesLink = screen.getByRole('link', {
      name: 'https://github.com/davgor/DarkMechanicus/releases/latest',
    });
    expect(releasesLink).toHaveAttribute(
      'href',
      'https://github.com/davgor/DarkMechanicus/releases/latest'
    );
  });

  it('renders the Dark Mechanicus screenshots with descriptive alt text', () => {
    render(<CodingReference />);
    const graph = screen.getByAltText(
      /^Dark Mechanicus plan graph for the epic Showcase Dark Mechanicus/
    );
    expect(graph).toHaveAttribute('src', '/assets/darkmechanicus/plan-graph.png');
    const editor = screen.getByAltText(/^Dark Mechanicus ticket editor panel for DGI-2/);
    expect(editor).toHaveAttribute('src', '/assets/darkmechanicus/ticket-editor.png');
  });

  it('adds the plan view section with caption and repository link', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => undefined)));
    render(<CodingReference />);
    expect(
      screen.getByRole('heading', { name: 'Dark Mechanicus plan for this section' })
    ).toBeInTheDocument();
    expect(screen.getByText(/saved plan of the epic that added this section/)).toBeInTheDocument();
    expect(screen.queryByText(/revision 2/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dark Mechanicus on GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/davgor/DarkMechanicus'
    );
  });

  it('puts the plan view inside the single Dark Mechanicus card', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => undefined)));
    render(<CodingReference />);
    const card = screen
      .getByRole('heading', { name: 'Dark Mechanicus', level: 2 })
      .closest('article');
    expect(card).not.toBeNull();
    const planHeading = screen.getByRole('heading', {
      name: 'Dark Mechanicus plan for this section',
    });
    expect(card!.contains(planHeading)).toBe(true);
    expect(card!.querySelector('.plan-view')).not.toBeNull();
    expect(card!.querySelectorAll('img[src^="/assets/darkmechanicus/"]')).toHaveLength(2);
  });

  it('still renders the Fantasy World Generator showcase', () => {
    render(<CodingReference />);
    expect(screen.getByTitle('MathLab world showcase')).toBeInTheDocument();
  });
});
