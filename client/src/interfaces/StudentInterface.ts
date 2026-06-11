import type { PaginatedResponse } from "./SharedInterfaces";

export interface StudentColumns {
  student_id: number;
  profile_picture: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix_name: string | null;
  gender_id: number;
  course_id: number;
  year_level_id: number;
  department_id: number;
  birth_date: string;
  age: number;
  username: string;
  status: "active" | "inactive";
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  gender?: {
    gender_id: number;
    gender: string;
  };
  course?: {
    course_id: number;
    course: string;
  };
  year_level?: {
    year_level_id: number;
    year_level: string;
  };
  department?: {
    department_id: number;
    department: string;
  };
}

export interface StudentFieldErrors {
  add_profile_picture?: string[];
  edit_profile_picture?: string[];
  first_name?: string[];
  middle_name?: string[];
  last_name?: string[];
  suffix_name?: string[];
  gender?: string[];
  course?: string[];
  year_level?: string[];
  department?: string[];
  birth_date?: string[];
  username?: string[];
  password?: string[];
  password_confirmation?: string[];
}

export interface LoadStudentsResponse {
  students: PaginatedResponse<StudentColumns>;
}

export interface StudentResponse {
  student: StudentColumns;
}

export interface StudentMessageResponse {
  message: string;
  student?: StudentColumns;
}

export interface StoreStudentPayload {
  add_profile_picture?: File | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix_name?: string | null;
  gender: number;
  course: number;
  year_level: number;
  department: number;
  birth_date: string;
  username: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateStudentPayload {
  edit_profile_picture?: File | null;
  remove_profile_picture?: "0" | "1";
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix_name?: string | null;
  gender: number;
  course: number;
  year_level: number;
  department: number;
  birth_date: string;
  username: string;
}
