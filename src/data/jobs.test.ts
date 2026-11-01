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
    expect(allText).toContain('The Agentic Test Lifecycle');
    expect(allText).toContain('test case manager');
    expect(allText).toContain('OTEL');
    expect(allText).toContain('bug crusher');
    expect(allText).toContain('0.5%');
    expect(allText).toContain('120 total hours');
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

  it('has Onebrief Manager, Outcome Engineering role as first role with correct title', () => {
    const onebrief = jobs.find((job) => job.id === 'onebrief');
    expect(onebrief).toBeDefined();
    expect(onebrief!.roles[0].title).toBe(
      'Onebrief - Manager, Outcome Engineering - Headless Agentic - 11/01/2026 - Present'
    );
  });

  it('has Engineering Manager, Quality role as second Onebrief role with end date', () => {
    const onebrief = jobs.find((job) => job.id === 'onebrief');
    expect(onebrief).toBeDefined();
    expect(onebrief!.roles[1].title).toBe(
      'Onebrief - Engineering Manager, Quality - 10/01/2025 - 11/01/2026'
    );
  });

  it('has exactly one Onebrief role ending with Present', () => {
    const onebrief = jobs.find((job) => job.id === 'onebrief');
    expect(onebrief).toBeDefined();
    const rolesWithPresent = onebrief!.roles.filter((role) => role.title.endsWith('Present'));
    expect(rolesWithPresent).toHaveLength(1);
  });

  it('has Onebrief Harness as first paragraph of Outcome Engineering role', () => {
    const onebrief = jobs.find((job) => job.id === 'onebrief');
    expect(onebrief).toBeDefined();
    const outcomeEngRole = onebrief!.roles[0];
    expect(outcomeEngRole.title).toContain('Manager, Outcome Engineering');
    expect(outcomeEngRole.paragraphs.length).toBeGreaterThan(0);
    expect(outcomeEngRole.paragraphs[0].title).toBe('Onebrief Harness');
  });

  it('Onebrief Harness paragraph includes key phrases about knowledge graph and Dark Factory', () => {
    const onebrief = jobs.find((job) => job.id === 'onebrief');
    expect(onebrief).toBeDefined();
    const outcomeEngRole = onebrief!.roles[0];
    const harnessParagraph = outcomeEngRole.paragraphs[0];
    const text = `${harnessParagraph.title} ${harnessParagraph.text}`;
    expect(text).toContain('knowledge graph');
    expect(text).toContain('Dark Factory');
  });

  it('has Dark Factory as second paragraph of Outcome Engineering role', () => {
    const onebrief = jobs.find((job) => job.id === 'onebrief');
    expect(onebrief).toBeDefined();
    const outcomeEngRole = onebrief!.roles[0];
    expect(outcomeEngRole.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(outcomeEngRole.paragraphs[1].title).toBe('Dark Factory');
  });

  it('Dark Factory paragraph includes key phrases about deterministic workflows and Agentic Test Lifecycle', () => {
    const onebrief = jobs.find((job) => job.id === 'onebrief');
    expect(onebrief).toBeDefined();
    const outcomeEngRole = onebrief!.roles[0];
    expect(outcomeEngRole.paragraphs.length).toBeGreaterThanOrEqual(2);
    const darkFactoryParagraph = outcomeEngRole.paragraphs[1];
    const text = `${darkFactoryParagraph.title} ${darkFactoryParagraph.text}`;
    expect(text).toContain('our home for repeatable development workflows');
    expect(text).toMatch(/(?<!non-)\bdeterministic workflows\b/);
    expect(text).toContain('non-deterministic');
    expect(text).toContain('various tooling');
    expect(text).toContain('Agentic Test Lifecycle');
    expect(text).not.toMatch(/orchestrate|effectively|we follow/i);
  });

  it('has Onebrief Code Reviewer as third paragraph of Outcome Engineering role', () => {
    const onebrief = jobs.find((job) => job.id === 'onebrief');
    expect(onebrief).toBeDefined();
    const outcomeEngRole = onebrief!.roles[0];
    expect(outcomeEngRole.paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(outcomeEngRole.paragraphs[2].title).toBe('Onebrief Code Reviewer');
  });

  it('Onebrief Code Reviewer paragraph includes key phrases about CodeRabbit, review and remediation, and personas', () => {
    const onebrief = jobs.find((job) => job.id === 'onebrief');
    expect(onebrief).toBeDefined();
    const outcomeEngRole = onebrief!.roles[0];
    expect(outcomeEngRole.paragraphs.length).toBeGreaterThanOrEqual(3);
    const codeReviewerParagraph = outcomeEngRole.paragraphs[2];
    const text = `${codeReviewerParagraph.title} ${codeReviewerParagraph.text}`;
    expect(text).toContain('CodeRabbit');
    expect(text).toContain('review and remediation');
    expect(text).toContain('"personas"');
  });
});
