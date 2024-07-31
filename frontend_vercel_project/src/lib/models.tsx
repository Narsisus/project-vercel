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
  customer_name: string;
  status: string;
  price: number;
  cafe_id: number;
  comments: string;
}