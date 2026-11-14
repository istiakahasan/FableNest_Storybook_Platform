// Single Book Item
export interface BookTypes {
  id: string;
  title: string;
  characterName: string;
  coverImageUrl: string;
  characterAge: number;
  gender: "Male" | "Female" | string;
  language: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Pagination Meta
export interface PaginationMetaTypes {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// API Response
export interface BooksApiResponseTypes {
  success: boolean;
  statusCode: number;
  message: string;
  meta: PaginationMetaTypes;
  data: BookTypes[];
}
