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

const BlogCard: React.FC<BlogCardProps> = ({ title, titleImage, content }) => {
  const renderContent = () => (
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      {content.map((item, index) => {
        if (typeof item === 'string') {
          // If the entire string is a URL, render as a standalone link
          if (isUrl(item)) {
            return (
              <p key={index} className="card-text">
                <a href={item.trim()} target="_blank" rel="noopener noreferrer">
                  {item.trim()}
                </a>
              </p>
            );
          }
          // Otherwise, linkify any URLs within the text
          return <p key={index} className="card-text">{linkifyText(item)}</p>;
        } else if (item.type === 'image') {
          return <img key={index} src={item.src} alt={item.alt || ''} className="img-fluid my-3" />;
        } else if (item.type === 'html') {
          return <div key={index} dangerouslySetInnerHTML={{ __html: item.content }} />;
        }
        return null;
      })}
    </div>
  );

  if (titleImage) {
    return (
      <div className="card mb-3 bg-transparent border-0" style={{ maxWidth: '100%' }}>
        <div className="row g-0 cardmargins">
          <div className="col-md-4">
            <img src={titleImage} className="img-fluid rounded-start" alt={title} />
          </div>
          <div className="col-md-8 cardbackdrop">{renderContent()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-3 bg-transparent border-0" style={{ maxWidth: '100%' }}>
      <div className="row g-0 cardmargins">
        <div className="col-md-12 cardbackdrop">{renderContent()}</div>
      </div>
    </div>
  );
};

export default BlogCard;
