import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

describe('Layout', () => {
  it('renders children content', () => {
    renderWithRouter(
      <Layout>
        <div data-testid="child-content">Test Content</div>
      </Layout>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders profile image', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    const profileImg = screen.getByAltText('Me!');
    expect(profileImg).toHaveAttribute('src', './assets/professional_photo.jpg');
  });

  it('renders name', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    expect(screen.getByText('David Gorden')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Coding Reference')).toBeInTheDocument();
    expect(screen.getByText('Dogs!')).toBeInTheDocument();
    expect(screen.getByText('Hobbies')).toBeInTheDocument();
    expect(screen.getByText('Contact Me')).toBeInTheDocument();
  });

  it('highlights About Me link when on home route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/' }
    );
    const aboutMeLink = screen.getByRole('link', { name: /About Me/i });
    expect(aboutMeLink).toHaveClass('active');
  });

  it('highlights Experience link when on experience route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/experience' }
    );
    const experienceLink = screen.getByRole('link', { name: /Experience/i });
    expect(experienceLink).toHaveClass('active');
  });

  it('highlights Coding Reference link when on coding-reference route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/coding-reference' }
    );
    const codingRefLink = screen.getByRole('link', { name: /Coding Reference/i });
    expect(codingRefLink).toHaveClass('active');
  });

  it('highlights Dogs link when on dogs route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/dogs' }
    );
    const dogsLink = screen.getByRole('link', { name: /Dogs!/i });
    expect(dogsLink).toHaveClass('active');
  });

  it('highlights Hobbies link when on hobbies route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/hobbies' }
    );
    const hobbiesLink = screen.getByRole('link', { name: /Hobbies/i });
    expect(hobbiesLink).toHaveClass('active');
  });

  it('highlights Contact Me link when on contact route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/contact' }
    );
    const contactLink = screen.getByRole('link', { name: /Contact Me/i });
    expect(contactLink).toHaveClass('active');
  });

  it('has correct link destinations', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    expect(screen.getByRole('link', { name: /About Me/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /Experience/i })).toHaveAttribute('href', '/experience');
    expect(screen.getByRole('link', { name: /Coding Reference/i })).toHaveAttribute('href', '/coding-reference');
    expect(screen.getByRole('link', { name: /Dogs!/i })).toHaveAttribute('href', '/dogs');
    expect(screen.getByRole('link', { name: /Hobbies/i })).toHaveAttribute('href', '/hobbies');
    expect(screen.getByRole('link', { name: /Contact Me/i })).toHaveAttribute('href', '/contact');
  });
});
