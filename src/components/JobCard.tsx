import React from 'react';
import { Job, Role } from '../types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const renderParagraphs = (role: Role, roleIndex: number) => {
    return (
      <div className="card-body" data-testid={`job-role-${job.id}-${roleIndex}`}>
        <h5 className="card-title" data-testid={`job-role-title-${job.id}-${roleIndex}`}>
          {role.title}
        </h5>
        <div className="card-text" data-testid={`job-role-content-${job.id}-${roleIndex}`}>
          {role.paragraphs.map((paragraph, index) => (
            <React.Fragment key={index}>
              {paragraph.title && (
                <h6 data-testid={`job-paragraph-title-${job.id}-${roleIndex}-${index}`}>
                  <b>{paragraph.title}</b>
                </h6>
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
            <h6 data-testid={`job-achievements-title-${job.id}-${roleIndex}`}>
              <b>{role.achievements.title}</b>
            </h6>
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
    <div
      className="card mb-3 bg-transparent border-0"
      style={{ maxWidth: '100%' }}
      data-testid={`job-card-${job.id}`}
    >
      <div className="row g-0 cardmargins">
        <div className="col-md-2 cardbackdrop" data-testid={`job-logo-container-${job.id}`}>
          <a href={job.website} data-testid={`job-website-link-${job.id}`}>
            <img
              src={job.logo}
              className="img-fluid rounded-start"
              style={{ paddingTop: '10px' }}
              alt="Company logo"
              data-testid={`job-logo-${job.id}`}
            />
          </a>
        </div>
        <div className="col-md-10 cardbackdrop" data-testid={`job-roles-container-${job.id}`}>
          {job.roles.map((role, index) => (
            <React.Fragment key={index}>{renderParagraphs(role, index)}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
