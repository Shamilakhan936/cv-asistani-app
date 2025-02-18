export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  seoTitle: string | null;
  seoDesc: string | null;
  author: {
    name: string;
    email: string;
  };
  categories: {
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    posts: number;
  };
}

export interface CategoryOption {
  value: string;
  label: string;
} 