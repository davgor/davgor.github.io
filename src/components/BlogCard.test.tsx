import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogCard, { ContentImage, ContentHtml } from './BlogCard';

describe('BlogCard', () => {
  it('renders the title', () => {
    render(<BlogCard title="Test Title" content={[]} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders string content as paragraphs', () => {
    render(
      <BlogCard
        title="Test"
        content={['First paragraph', 'Second paragraph']}
      />
    );
    expect(screen.getByText('First paragraph')).toBeInTheDocument();
    expect(screen.getByText('Second paragraph')).toBeInTheDocument();
  });

  it('renders URLs as clickable links', () => {
    render(
      <BlogCard title="Test" content={['https://example.com']} />
    );
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('linkifies URLs within text', () => {
    render(
      <BlogCard
        title="Test"
        content={['Check out https://example.com for more info']}
      />
    );
    const link = screen.getByRole('link', { name: 'https://example.com' });
    expect(link).toBeInTheDocument();
    expect(screen.getByText(/Check out/)).toBeInTheDocument();
    expect(screen.getByText(/for more info/)).toBeInTheDocument();
  });

  it('renders image content', () => {
    const imageContent: ContentImage = {
      type: 'image',
      src: '/test-image.png',
      alt: 'Test image',
    };
    render(<BlogCard title="Test" content={[imageContent]} />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('src', '/test-image.png');
  });

  it('renders HTML content', () => {
    const htmlContent: ContentHtml = {
      type: 'html',
      content: '<strong>Bold text</strong>',
    };
    render(<BlogCard title="Test" content={[htmlContent]} />);
    expect(screen.getByText('Bold text')).toBeInTheDocument();
  });

  it('renders title image when provided', () => {
    render(
      <BlogCard
        title="Test Title"
        titleImage="/title-image.png"
        content={['Content']}
      />
    );
    const img = screen.getByAltText('Test Title');
    expect(img).toHaveAttribute('src', '/title-image.png');
  });

  it('returns null for unknown content types', () => {
    const unknownContent = { type: 'unknown', data: 'test' } as unknown as ContentImage;
    const { container } = render(
      <BlogCard title="Test" content={[unknownContent]} />
    );
    // Should only have the title, no other content rendered
    const cardBody = container.querySelector('.card-body');
    expect(cardBody).toBeInTheDocument();
    // Just 1 child element (the h5 title) since unknown type returns null
    const paragraphs = cardBody?.querySelectorAll('p');
    expect(paragraphs?.length).toBe(0);
  });

  it('renders image without alt text', () => {
    const imageContent: ContentImage = {
      type: 'image',
      src: '/test-image.png',
    };
    const { container } = render(<BlogCard title="Test" content={[imageContent]} />);
    const img = container.querySelector('img[src="/test-image.png"]');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', '');
  });
});
