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

const BlogCard: React.FC<BlogCardProps> = ({ title, titleImage, content }) => {
  const renderContent = () => (
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      {content.map((item, index) => {
        if (typeof item === 'string') {
          return <p key={index} className="card-text" dangerouslySetInnerHTML={{ __html: item }} />;
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
