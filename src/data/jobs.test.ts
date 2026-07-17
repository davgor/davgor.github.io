import { describe, it, expect } from 'vitest';
import { jobs } from './jobs';

describe('jobs data', () => {
  it('includes the expected employers', () => {
    expect(jobs.map((job) => job.id)).toEqual([
      'onebrief',
      'blackpointcyber',
      'lyft',
      'atreo',
      'emcinsurance',
      'geeksquad',
    ]);
  });

  it('gives every job a website, logo, and at least one role', () => {
    for (const job of jobs) {
      expect(job.id.length).toBeGreaterThan(0);
      expect(job.website).toMatch(/^https?:\/\//);
      expect(job.logo.length).toBeGreaterThan(0);
      expect(job.roles.length).toBeGreaterThan(0);
    }
  });

  it('gives every role a title, paragraphs, and valid achievements when present', () => {
    for (const job of jobs) {
      for (const role of job.roles) {
        expect(role.title.length).toBeGreaterThan(0);
        expect(role.paragraphs.length).toBeGreaterThan(0);
        for (const paragraph of role.paragraphs) {
          expect(paragraph.text.length).toBeGreaterThan(0);
        }
        if (role.achievements) {
          expect(role.achievements.title.length).toBeGreaterThan(0);
          expect(role.achievements.list.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
