import React from 'react';
import JobCard from '../components/JobCard';
import { jobs } from '../data/jobs';

const Experience: React.FC = () => {
  return (
    <>
      {jobs.map((job, index) => (
        <JobCard key={index} job={job} />
      ))}
    </>
  );
};

export default Experience;
