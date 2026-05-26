export interface RoleColumns {
  role_id: number;
  role: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoleFieldErrors {
  role?: string[];
}
