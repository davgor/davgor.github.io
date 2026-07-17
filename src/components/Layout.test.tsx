import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Layout from './Layout';
import { renderWithRouter } from '../test/renderWithRouter';

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

  it('renders profile image in the header', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    const profileImg = screen.getByAltText('Me!');
    expect(profileImg).toHaveAttribute('src', './assets/professional_photo.jpg');
  });

  it('renders name as brand link to home', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    const brand = screen.getByRole('link', { name: /David Gorden/i });
    expect(brand).toHaveAttribute('href', '/');
  });

  it('renders a site navigation landmark', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    expect(screen.getByRole('link', { name: /^About Me$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Experience$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Coding Reference$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Dogs!$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Hobbies$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Contact Me$/i })).toBeInTheDocument();
  });

  it('marks About Me as current when on home route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/' }
    );
    const aboutMeLink = screen.getByRole('link', { name: /^About Me$/i });
    expect(aboutMeLink).toHaveAttribute('aria-current', 'page');
  });

  it('marks Experience as current when on experience route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/experience' }
    );
    const experienceLink = screen.getByRole('link', { name: /^Experience$/i });
    expect(experienceLink).toHaveAttribute('aria-current', 'page');
  });

  it('marks Coding Reference as current when on coding-reference route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/coding-reference' }
    );
    const codingRefLink = screen.getByRole('link', { name: /^Coding Reference$/i });
    expect(codingRefLink).toHaveAttribute('aria-current', 'page');
  });

  it('marks Dogs as current when on dogs route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/dogs' }
    );
    const dogsLink = screen.getByRole('link', { name: /^Dogs!$/i });
    expect(dogsLink).toHaveAttribute('aria-current', 'page');
  });

  it('marks Hobbies as current when on hobbies route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/hobbies' }
    );
    const hobbiesLink = screen.getByRole('link', { name: /^Hobbies$/i });
    expect(hobbiesLink).toHaveAttribute('aria-current', 'page');
  });

  it('marks Contact Me as current when on contact route', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>,
      { route: '/contact' }
    );
    const contactLink = screen.getByRole('link', { name: /^Contact Me$/i });
    expect(contactLink).toHaveAttribute('aria-current', 'page');
  });

  it('has correct link destinations', () => {
    renderWithRouter(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    expect(screen.getByRole('link', { name: /^About Me$/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /^Experience$/i })).toHaveAttribute(
      'href',
      '/experience'
    );
    expect(screen.getByRole('link', { name: /^Coding Reference$/i })).toHaveAttribute(
      'href',
      '/coding-reference'
    );
    expect(screen.getByRole('link', { name: /^Dogs!$/i })).toHaveAttribute('href', '/dogs');
    expect(screen.getByRole('link', { name: /^Hobbies$/i })).toHaveAttribute('href', '/hobbies');
    expect(screen.getByRole('link', { name: /^Contact Me$/i })).toHaveAttribute('href', '/contact');
  });
});
