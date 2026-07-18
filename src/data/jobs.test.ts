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

  it('uses correct spelling and grammar in key experience phrases', () => {
    const allText = jobs
      .flatMap((job) => job.roles)
      .flatMap((role) => [
        ...role.paragraphs.map((paragraph) => `${paragraph.title} ${paragraph.text}`),
        ...(role.achievements?.list ?? []),
      ])
      .join('\n');

    expect(allText).toContain('AI quarantine bot');
    expect(allText).toContain('QA embedded processes');
    expect(allText).toContain('development team Odyssey');
    expect(allText).toContain('first saw at Lyft');
    expect(allText).toContain('allowed us to create an extensive test plan');
    expect(allText).toContain("keep the project's quality high");
    expect(allText).toContain('well-oiled machine');
    expect(allText).toContain('counteract these issues');
    expect(allText).toContain("improve the team's efficiency to the point where");
    expect(allText).toContain('full-fledged QA');
    expect(allText).toContain('company-wide adoption');
    expect(allText).toContain('After a month of being a staff SDET');
    expect(allText).not.toMatch(/quarentine|processess|Title's|Shepard|Malenois/);
  });
});
