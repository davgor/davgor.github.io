import React from 'react';
import BlogCard, { ContentImage } from '../components/BlogCard';

const electronServerManager: ContentImage = {
    type: 'image',
    src: './assets/Server_manager.png',
    alt: 'App screenshot'
};

const CodingReference: React.FC = () => {
  return (
    <>
      <BlogCard
        title="Coding Reference"
        content={[
          'Here is where I will discuss the different repositories I have made recently, feel free to check out my github page as well.',
          'https://github.com/davgor'
        ]}
      />
      <BlogCard
        title="davgor.github.io"
        content={[
          'Well this site obviously, I wanted to make a personal website, where I can share my projects, give more indepth information about my experiences, and about who I am as an engineer and a leader. Recently converted it over to using react, over traditional html/javascript, and I\'ll mostly be using it as a place to lightly experiment with AI, and react. Feel free to dig into any of the areas I have setup. Its a pretty simple page, but I think it does a decent enough job as an extended resume.',
          'https://github.com/davgor/davgor.github.io'
        ]}
      />
      <BlogCard
        title="Electron Server Manager"
        content={[
          'A desktop application built with Electron, React, and TypeScript for managing Steam dedicated game servers. The app auto-detects installed servers by scanning Steam library folders and registry entries, showing their running status in real-time.',
          'Currently supports Enshrouded, and Palworld, with the ability to manually add other servers. Key features include auto-restart on crash, auto-update, configurable backup intervals with custom save locations, and a built-in config editor supporting JSON, YAML, INI, and properties files.',
          'The architecture uses secure IPC communication between the main Node.js process and the React renderer, with full context isolation and TypeScript throughout. Cross-platform support for Windows, macOS, and Linux. (maybe, local usecase has be doing it on windows.)',
          'GitHub Actions handles automatic versioning and release builds, so each merge creates a new distributable version. Feel free to download and use it!',
          'https://github.com/davgor/ElectronServerManager',
          electronServerManager
        ]}
      />
    </>
  );
};

export default CodingReference;
