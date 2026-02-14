import React from 'react';
import { Job, Role } from '../types';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const renderParagraphs = (role: Role) => {
    return (
      <div className="card-body">
        <h5 className="card-title">{role.title}</h5>
        <p className="card-text">
          {role.paragraphs.map((paragraph, index) => (
            <React.Fragment key={index}>
              {paragraph.title && <h6><b>{paragraph.title}</b></h6>}
              <p dangerouslySetInnerHTML={{ __html: paragraph.text }} />
            </React.Fragment>
          ))}
        </p>
        {role.achievements && (
          <>
            <h6><b>{role.achievements.title}</b></h6>
            <ul>
              {role.achievements.list.map((achievement, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: achievement }} />
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="card mb-3 bg-transparent border-0" style={{ maxWidth: '100%' }}>
      <div className="row g-0 cardmargins">
        <div className="col-md-2 cardbackdrop">
          <a href={job.website}>
            <img src={job.logo} className="img-fluid rounded-start" style={{ paddingTop: '10px' }} alt="Company logo" />
          </a>
        </div>
        <div className="col-md-10 cardbackdrop">
          {job.roles.map((role, index) => (
            <React.Fragment key={index}>
              {renderParagraphs(role)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
