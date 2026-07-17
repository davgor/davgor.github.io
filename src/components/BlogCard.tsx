import React from 'react';

export interface ContentImage {
  type: 'image';
  src: string;
  alt?: string;
}

export interface ContentHtml {
  type: 'html';
  content: string;
}

export type ContentItem = string | ContentImage | ContentHtml;

interface BlogCardProps {
  title: string;
  titleImage?: string;
  /** CSS object-position for the title image (e.g. "left center"). */
  titleImageObjectPosition?: string;
  content: ContentItem[];
}

const urlRegex = /(https?:\/\/[^\s<]+)/g;

const isUrl = (text: string): boolean => {
  return /^https?:\/\/[^\s]+$/.test(text.trim());
};

const linkifyText = (text: string): React.ReactNode => {
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      urlRegex.lastIndex = 0; // Reset regex state
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
};

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  titleImage,
  titleImageObjectPosition,
  content,
}) => {
  const renderContent = () => (
    <div className="content-card__body" data-testid="content-card-body">
      <h2 className="content-card__title">{title}</h2>
      {content.map((item, index) => {
        if (typeof item === 'string') {
          if (isUrl(item)) {
            return (
              <p key={index} className="content-card__text">
                <a href={item.trim()} target="_blank" rel="noopener noreferrer">
                  {item.trim()}
                </a>
              </p>
            );
          }
          return (
            <p key={index} className="content-card__text">
              {linkifyText(item)}
            </p>
          );
        } else if (item.type === 'image') {
          return (
            <img key={index} src={item.src} alt={item.alt || ''} className="content-card__image" />
          );
        } else if (item.type === 'html') {
          return <div key={index} dangerouslySetInnerHTML={{ __html: item.content }} />;
        }
        return null;
      })}
    </div>
  );

  if (titleImage) {
    return (
      <article className="content-card content-card--with-image" data-testid="content-card">
        <div className="content-card__media">
          <img
            src={titleImage}
            alt={title}
            style={
              titleImageObjectPosition ? { objectPosition: titleImageObjectPosition } : undefined
            }
          />
        </div>
        {renderContent()}
      </article>
    );
  }

  return (
    <article className="content-card" data-testid="content-card">
      {renderContent()}
    </article>
  );
};

export default BlogCard;
