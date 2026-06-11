// src/interfaces/PersonnelInterface.ts

import type { PaginatedResponse } from "./SharedInterfaces";

export interface PersonnelColumns {
  personnel_id: number;
  profile_picture: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix_name: string | null;
  gender_id: number;
  role_id: number;
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
  role?: {
    role_id: number;
    role: string;
  };
  department?: {
    department_id: number;
    department: string;
  };
}

// Add these exports for RequestForm compatibility
export interface Personnel {
  personnel_id: number;
  profile_picture: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix_name: string | null;
  gender_id: number;
  role_id: number;
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
  role?: {
    role_id: number;
    role: string;
  };
  department?: {
    department_id: number;
    department: string;
  };
}

export interface Student {
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
  yearLevel?: {
    year_level_id: number;
    year_level: string;
  };
  department?: {
    department_id: number;
    department: string;
  };
}

export interface PersonnelFieldErrors {
  add_profile_picture?: string[];
  edit_profile_picture?: string[];
  first_name?: string[];
  middle_name?: string[];
  last_name?: string[];
  suffix_name?: string[];
  gender?: string[];
  role?: string[];
  department?: string[];
  birth_date?: string[];
  username?: string[];
  password?: string[];
  password_confirmation?: string[];
}

export interface LoadPersonnelsResponse {
  personnels: PaginatedResponse<PersonnelColumns>;
}

export interface PersonnelResponse {
  personnel: PersonnelColumns;
}

export interface PersonnelMessageResponse {
  message: string;
  personnel?: PersonnelColumns;
}

export interface StorePersonnelPayload {
  add_profile_picture?: File | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix_name?: string | null;
  gender: number;
  role: number;
  department: number;
  birth_date: string;
  username: string;
  password: string;
  password_confirmation: string;
}

export interface UpdatePersonnelPayload {
  edit_profile_picture?: File | null;
  remove_profile_picture?: "0" | "1";
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix_name?: string | null;
  gender: number;
  role: number;
  department: number;
  birth_date: string;
  username: string;
}
