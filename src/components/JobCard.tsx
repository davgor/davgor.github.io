import React from 'react';
import { Job, Role } from '../types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const renderParagraphs = (role: Role, roleIndex: number) => {
    return (
      <div className="job-card__role" data-testid={`job-role-${job.id}-${roleIndex}`}>
        <h2 className="job-card__role-title" data-testid={`job-role-title-${job.id}-${roleIndex}`}>
          {role.title}
        </h2>
        <div data-testid={`job-role-content-${job.id}-${roleIndex}`}>
          {role.paragraphs.map((paragraph, index) => (
            <React.Fragment key={index}>
              {paragraph.title && (
                <h3
                  className="job-card__section-title"
                  data-testid={`job-paragraph-title-${job.id}-${roleIndex}-${index}`}
                >
                  <b>{paragraph.title}</b>
                </h3>
              )}
              <p
                data-testid={`job-paragraph-text-${job.id}-${roleIndex}-${index}`}
                dangerouslySetInnerHTML={{ __html: paragraph.text }}
              />
            </React.Fragment>
          ))}
        </div>
        {role.achievements && (
          <div data-testid={`job-achievements-${job.id}-${roleIndex}`}>
            <h3
              className="job-card__section-title"
              data-testid={`job-achievements-title-${job.id}-${roleIndex}`}
            >
              <b>{role.achievements.title}</b>
            </h3>
            <ul data-testid={`job-achievements-list-${job.id}-${roleIndex}`}>
              {role.achievements.list.map((achievement, index) => (
                <li
                  key={index}
                  data-testid={`job-achievement-item-${job.id}-${roleIndex}-${index}`}
                  dangerouslySetInnerHTML={{ __html: achievement }}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <article className="job-card" data-testid={`job-card-${job.id}`}>
      <div className="job-card__logo" data-testid={`job-logo-container-${job.id}`}>
        <a href={job.website} data-testid={`job-website-link-${job.id}`}>
          <img src={job.logo} alt="Company logo" data-testid={`job-logo-${job.id}`} />
        </a>
      </div>
      <div className="job-card__roles" data-testid={`job-roles-container-${job.id}`}>
        {job.roles.map((role, index) => (
          <React.Fragment key={index}>{renderParagraphs(role, index)}</React.Fragment>
        ))}
      </div>
    </article>
  );
};

export default JobCard;
