import React from 'react';
import BlogCard, { ContentImage } from '../components/BlogCard';

const electronServerManager: ContentImage = {
  type: 'image',
  src: '/assets/Server_manager.png',
  alt: 'App screenshot',
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
    </>
  );
};

export default CodingReference;
