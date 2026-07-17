import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Experience from './Experience';
import { jobs } from '../data/jobs';

describe('Experience', () => {
  it('renders a job card for every job', () => {
    render(<Experience />);
    for (const job of jobs) {
      expect(screen.getByTestId(`job-card-${job.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`job-logo-${job.id}`)).toHaveAttribute('src', job.logo);
      expect(screen.getByTestId(`job-website-link-${job.id}`)).toHaveAttribute('href', job.website);
    }
  });

  it('renders each role title from the jobs data', () => {
    render(<Experience />);
    for (const job of jobs) {
      job.roles.forEach((role, roleIndex) => {
        expect(screen.getByTestId(`job-role-title-${job.id}-${roleIndex}`)).toHaveTextContent(
          role.title
        );
      });
    }
  });
});
