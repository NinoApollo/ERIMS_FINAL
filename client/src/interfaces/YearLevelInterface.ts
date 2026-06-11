export interface YearLevelColumns {
  year_level_id: number;
  year_level: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface YearLevelFieldErrors {
  year_level?: string[];
}
