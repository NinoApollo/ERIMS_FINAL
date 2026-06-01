import type { CourseColumns } from "./CourseInterface";

export interface LaboratoryColumns {
  laboratory_id: number;
  laboratory: string;
  course_id: number;
  course: CourseColumns;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface LaboratoryFieldErrors {
  laboratory?: string[];
  course_id?: string[];
}
