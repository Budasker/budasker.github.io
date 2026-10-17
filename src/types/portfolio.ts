export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Project {
  title: string;
  category: string;
  description: string;
  metrics: string[];
  tags: string[];
  repoLink?: string;
  linkText?: string;
}

export interface WriteupFrontmatter {
  title: string;
  date: string;
  category: string;
  description: string;
  tags?: string[];
  layout?: string;
}

export interface WriteupPost {
  url: string;
  frontmatter: WriteupFrontmatter;
}

export interface SiteConfig {
  author: string;
  handle: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  role: string;
  bio: string;
  location: string;
  social: {
    github: string;
    email: string;
  };
}

export interface MentorshipLesson {
  url: string;
  title: string;
  description?: string;
  order: number;
  duration?: string;
  level?: string;
  date?: string;
}

export interface MentorshipTrack {
  folderSlug: string;
  title: string;
  description: string;
  icon: string;
  level: string;
  totalLessons: number;
  tags: string[];
  lessons: MentorshipLesson[];
}
