export type BlogCategory = 'gaming' | 'webdev' | 'seo' | 'hardware';

export interface Comment {
  id: string;
  author: string;
  avatarSeed: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: BlogCategory;
  categoryLabel: string;
  readTime: string;
  publishedAt: string;
  author: string;
  authorRole: string;
  authorId?: string;
  tags: string[];
  likes: number;
  views: number;
  featured?: boolean;
  coverTheme: 'vice' | 'tactical' | 'cyber' | 'speed' | 'code' | 'hardware';
  status?: 'published' | 'archived';
  comments?: Comment[];
}

export interface ServicePackage {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  idealFor: string;
  timeframe: string;
  startingPrice: string;
  badge?: string;
}

export interface InquiryFormState {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  budget: string;
  message: string;
}
