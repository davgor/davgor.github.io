export interface Paragraph {
  title: string;
  text: string;
}

export interface Achievement {
  title: string;
  list: string[];
}

export interface Role {
  title: string;
  paragraphs: Paragraph[];
  achievements?: Achievement;
}

export interface Job {
  website: string;
  logo: string;
  roles: Role[];
}
