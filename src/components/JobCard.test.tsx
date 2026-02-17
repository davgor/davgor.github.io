import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import JobCard from './JobCard';
import { Job } from '../types';

const mockJob: Job = {
  id: 'test-job',
  logo: '/test-logo.png',
  website: 'https://testcompany.com',
  roles: [
    {
      title: 'Software Engineer',
      paragraphs: [
        {
          title: 'Responsibilities',
          text: 'Building awesome software',
        },
        {
          title: '',
          text: 'Working with a great team',
        },
      ],
      achievements: {
        title: 'Key Achievements',
        list: ['Shipped major feature', 'Improved performance by 50%'],
      },
    },
  ],
};

describe('JobCard', () => {
  it('renders job card with correct test id', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByTestId('job-card-test-job')).toBeInTheDocument();
  });

  it('renders company logo with link to website', () => {
    render(<JobCard job={mockJob} />);
    const logo = screen.getByTestId('job-logo-test-job');
    expect(logo).toHaveAttribute('src', '/test-logo.png');
    
    const link = screen.getByTestId('job-website-link-test-job');
    expect(link).toHaveAttribute('href', 'https://testcompany.com');
  });

  it('renders role title', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByTestId('job-role-title-test-job-0')).toHaveTextContent(
      'Software Engineer'
    );
  });

  it('renders paragraph with title', () => {
    render(<JobCard job={mockJob} />);
    expect(
      screen.getByTestId('job-paragraph-title-test-job-0-0')
    ).toHaveTextContent('Responsibilities');
    expect(
      screen.getByTestId('job-paragraph-text-test-job-0-0')
    ).toHaveTextContent('Building awesome software');
  });

  it('renders paragraph without title', () => {
    render(<JobCard job={mockJob} />);
    expect(
      screen.getByTestId('job-paragraph-text-test-job-0-1')
    ).toHaveTextContent('Working with a great team');
  });

  it('renders achievements section', () => {
    render(<JobCard job={mockJob} />);
    expect(
      screen.getByTestId('job-achievements-title-test-job-0')
    ).toHaveTextContent('Key Achievements');
    expect(
      screen.getByTestId('job-achievement-item-test-job-0-0')
    ).toHaveTextContent('Shipped major feature');
    expect(
      screen.getByTestId('job-achievement-item-test-job-0-1')
    ).toHaveTextContent('Improved performance by 50%');
  });

  it('renders multiple roles', () => {
    const jobWithMultipleRoles: Job = {
      ...mockJob,
      roles: [
        {
          title: 'Senior Engineer',
          paragraphs: [{ title: '', text: 'Leading projects' }],
        },
        {
          title: 'Junior Engineer',
          paragraphs: [{ title: '', text: 'Learning and growing' }],
        },
      ],
    };
    render(<JobCard job={jobWithMultipleRoles} />);
    expect(screen.getByTestId('job-role-title-test-job-0')).toHaveTextContent(
      'Senior Engineer'
    );
    expect(screen.getByTestId('job-role-title-test-job-1')).toHaveTextContent(
      'Junior Engineer'
    );
  });
});
