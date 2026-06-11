export interface LaboratoryColumns {
  laboratory_id: number;
  laboratory: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface LaboratoryFieldErrors {
  laboratory?: string[];
}
