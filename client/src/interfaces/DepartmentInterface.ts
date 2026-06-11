export interface DepartmentColumns {
  department_id: number;
  department: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartmentFieldErrors {
  department?: string[];
}
