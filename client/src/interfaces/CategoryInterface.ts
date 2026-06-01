export interface CategoryColumns {
  category_id: number;
  category: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryFieldErrors {
  category?: string[];
}
