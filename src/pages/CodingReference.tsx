import React from 'react';
import BlogCard, { ContentImage } from '../components/BlogCard';
import DarkMechanicusPlanView from '../components/DarkMechanicusPlanView';

const electronServerManager: ContentImage = {
  type: 'image',
  src: '/assets/Server_manager.png',
  alt: 'App screenshot',
};

const darkMechanicusPlanGraph: ContentImage = {
  type: 'image',
  src: '/assets/darkmechanicus/plan-graph.png',
  alt: 'Dark Mechanicus plan graph for the epic Showcase Dark Mechanicus on Coding Reference: six ticket nodes (DGI-1 to DGI-6) in one sprint, joined by prerequisite arrows, with DGI-1, DGI-3 and DGI-4 accepted, DGI-2 running, DGI-5 and DGI-6 waiting, and the status legend at right.',
};

const darkMechanicusTicketEditor: ContentImage = {
  type: 'image',
  src: '/assets/darkmechanicus/ticket-editor.png',
  alt: 'Dark Mechanicus ticket editor panel for DGI-2, Capture and prepare Dark Mechanicus app screenshots, open beside the plan graph, showing the four acceptance criteria and the capability profile (quality, work type, reasoning, tools, modalities, context and skills).',
};

const CodingReference: React.FC = () => {
  return (
    <>
      <BlogCard
        title="Coding Reference"
        content={[
          'Here is where I will discuss the different repositories I have made recently. Feel free to check out my GitHub page as well.',
          'https://github.com/davgor',
        ]}
      />
      <section aria-labelledby="mathlab-title" className="mathlab-showcase">
        <h2 id="mathlab-title">Fantasy World Generator — World Showcase</h2>
        <p>
          A procedural fantasy-world simulation: overlapping magical networks, cold and aquatic
          habitats, settlements, floating islands, and catalogue-driven beast lairs. Explore three
          saved worlds below, regenerated after each merge to the generator’s main branch. GitHub
          Pages serves these samples; generate custom worlds by running the Python project locally.
        </p>
        <p>
          <a href="/mathlab/" target="_blank" rel="noopener noreferrer">
            Open showcase in a full window
          </a>
          {' · '}
          <a
            href="https://github.com/davgor/FantasyWorldGenerator"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fantasy World Generator source
          </a>
        </p>
        <iframe
          title="MathLab world showcase"
          src="/mathlab/index.html"
          loading="lazy"
          sandbox="allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox"
          className="mathlab-window"
        />
      </section>
      <BlogCard
        title="Dark Mechanicus"
        content={[
          'I built Dark Mechanicus to coordinate planning and execution for agentic development on my own machine. It has an MCP server for agents and an Electron desktop app for people, and both work on the same repository-owned state under the same rules, on Windows and macOS.',
          'The flow is the part I care about. An agent drafts an epic as tickets with acceptance criteria and capability profiles, wires up dependencies and sprint checkpoints, and saves it only as a draft. I review the plan graph in the desktop app and press Save, because the saved plan only changes on Save. An orchestrator agent then runs that saved revision, claims ready tickets for its workers, and stops at every sprint checkpoint until I approve.',
          'Most of the design is about keeping those rules out of the clients. The rules live in one shared command layer, so the MCP handlers and the desktop app are only adapters, and roles are fixed when a session registers rather than taken from anything a caller supplies. Plans are written as JSON records under .darkmechanicus/ that Git tracks, while the SQLite working database sits in a Git-ignored local/ folder. The MCP server runs headless, so agents can plan and execute with the desktop closed.',
          'I wrote it with Electron, React, and TypeScript, using the built-in node:sqlite, the MCP SDK, React Flow for the plan graph, and zod for validation. CI packages Windows and macOS builds to GitHub Releases, and packaged Windows builds update themselves through electron-updater; macOS installs are manual for now.',
          'https://github.com/davgor/DarkMechanicus',
          'https://github.com/davgor/DarkMechanicus/releases/latest',
          darkMechanicusPlanGraph,
          darkMechanicusTicketEditor,
        ]}
      />
      <section aria-labelledby="dm-plan-title" className="dm-plan-section">
        <h2 id="dm-plan-title">Dark Mechanicus plan for this section</h2>
        <p>
          This is the saved plan (revision 2, saved 2 October 2026) of the epic that added this
          section, read from the repository&apos;s committed Dark Mechanicus records.{' '}
          <a
            href="https://github.com/davgor/DarkMechanicus"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dark Mechanicus on GitHub
          </a>
        </p>
        <DarkMechanicusPlanView />
      </section>
      <BlogCard
        title="davgor.github.io"
        content={[
          "Well, this site, obviously. I wanted to make a personal website where I can share my projects, give more in-depth information about my experiences, and about who I am as an engineer and a leader. I recently converted it over to using React over traditional HTML/JavaScript, and I'll mostly be using it as a place to lightly experiment with AI and React. Feel free to dig into any of the areas I have set up. It's a pretty simple page, but I think it does a decent enough job as an extended resume.",
          'https://github.com/davgor/davgor.github.io',
        ]}
      />
      <BlogCard
        title="Electron Server Manager"
        content={[
          'A frameless Electron + React + TypeScript desktop app for managing Steam dedicated game servers. It scans Steam libraries for installed dedicated servers in a built-in catalog, shows cover art when available, and lets you start, stop, and watch recent server output from one UI.',
          'Currently ships with Enshrouded and Palworld in the catalog, with a documented path for adding more. Key features include auto-restart on crash, SteamCMD game-file updates, timed or manual save backups to a folder you choose, and an in-app config editor for JSON and INI with search across the tree. Palworld also gets a REST admin panel and a live ops view when the in-game REST API is enabled.',
          'The architecture keeps Node work in the main process behind typed, allowlisted IPC, with context isolation and no nodeIntegration in the renderer. Windows is my day-to-day target; Linux and macOS are supported where the catalog defines platform-specific executables and config paths.',
          'Packaged builds check GitHub Releases for app auto-updates, and CI produces distributables on merge. Feel free to download and use it!',
          'https://github.com/davgor/ElectronServerManager',
          electronServerManager,
        ]}
      />
      <BlogCard
        title="AI-DND-Matrix"
        content={[
          'AI-DND-Matrix (also called AI-TTRPG in the repo) is a single-player, text-adventure-style TTRPG desktop app built with Electron, React, and TypeScript. Two cooperating AI agents run the game: a DM agent that sets scenes, drives the plot, and designs encounters, and NPC/party-member agents that roleplay individual characters and enemies.',
          'Campaigns are generated from a free-text prompt and then played in a durable world. If you burn down a village, later scenes remember it is gone. Each campaign supports multiple player characters in one shared world, with a campaign hub for world preview and character management after the first character is created.',
          'The important design choice is that the engine and database are the source of truth. Agents narrate and propose actions, but a deterministic rules engine validates dice, checks, damage, and death before anything is persisted. Every agent call is re-grounded from SQLite rather than chat history, and NPCs keep isolated memory so they only know what they would have experienced.',
          'The stack is Electron with a secure IPC baseline, React UI, TypeScript throughout, and SQLite via better-sqlite3 for one save per campaign. LLM providers are pluggable at runtime—Claude by default, plus a local Player2 option—without a rebuild. CI packages NSIS and portable Windows builds to GitHub Releases. Personal project for now, shared as a packaged .exe with friends.',
          'https://github.com/davgor/AI-DND-Matrix',
        ]}
      />
      <BlogCard
        title="BoosterSeat"
        content={[
          'BoosterSeat is my quick-start template for spinning up a new CRUD app. I pulled the battle-tested process from CapitalGains and this site—CI/CD, fireguard, board tickets, Cursor/Claude skills—and wrapped it around a replaceable Vite + React + TypeScript CRUD scaffold so I am not rebuilding scaffolding from scratch every time.',
          'Out of the box you get the engineering process I actually use: TDD-first delivery standards, strict ESLint, a markdown ticket board, and mandatory red-team review before merge. CI runs unit tests, fireguard grading on new tests, lint, type-check, deadcode, security audit, and Playwright, plus auto-revert when main goes red. Deploy defaults to GitHub Pages via Actions with a production HTML smoke check.',
          'There are stack playbooks for React Pages (the default) and Electron conversion under templates/, plus docs for turning the fork into a real product. If I am starting something new and want the agent process and quality gates already wired, this is what I copy.',
          'https://github.com/davgor/BoosterSeat',
        ]}
      />
    </>
  );
};

export default CodingReference;
