export interface Book {
  id?: string;
  title: string;
  author: string;
  category: string;
  description: string;
  condition: 'new' | 'good' | 'used';
  coverImage: string | null;
  pdfFile: string | null;
  isAvailable: boolean;
  location: string;
  userId?:string
  username?:string
}