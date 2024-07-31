export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  is_published: boolean;
  description: string;
  summary: string;
  categories: string[];
}

export interface Cafe{
  id: number;
  name: string;
  price: number;
  comments: string;
}

export interface Order {
  id: number;
  total_order: string[];
  status: string;
  total_price: number;
  comments: string;
}