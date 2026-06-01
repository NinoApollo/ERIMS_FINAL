export interface CourseColumns {
  course_id: number;
  course: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseFieldErrors {
  course?: string[];
}
