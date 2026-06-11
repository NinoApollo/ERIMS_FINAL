export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface Role {
  role_id: number;
  role: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Gender {
  gender_id: number;
  gender: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  course_id: number;
  course: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface YearLevel {
  year_level_id: number;
  year_level: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  department_id: number;
  department: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Area {
  area_id: number;
  area: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  category_id: number;
  category: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Laboratory {
  laboratory_id: number;
  laboratory: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  equipment_id: number;
  category_id: number;
  area_id: number;
  equipment_code: string;
  equipment_name: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  description: string | null;
  quantity: number;
  available_quantity: number;
  unit: "pcs" | "set" | "unit";
  purchase_date: string | null;
  purchase_cost: number | null;
  condition: "new" | "good" | "fair" | "damaged";
  status:
    | "available"
    | "in_use"
    | "borrowed"
    | "maintenance"
    | "lost"
    | "returned";
  image: string | null;
  remarks: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  area?: Area;
}
