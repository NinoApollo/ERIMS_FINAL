// src/interfaces/RequestFormInterface.ts

import type {
  Area,
  Course,
  Laboratory,
  PaginatedResponse,
} from "./SharedInterfaces";
import type { Personnel, Student } from "./PersonnelInterface";

export type RequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "ongoing"
  | "completed"
  | "cancelled";

export type RequestType = "borrow" | "maintenance" | "repair" | "release";

export interface RequestFormItem {
  equipment_id: number;
  equipment_name?: string;
  equipment_code?: string;
  quantity: number;
  unit: "pcs" | "set" | "unit";
  remarks: string | null;
}

export interface RequestForm {
  request_id: number;
  request_number: string;
  requestor_id: number;
  requestor_type: "student" | "personnel";
  laboratory_id: number;
  area_id: number | null;
  course_id: number | null;
  faculty_incharge_id: number | null;
  subject: string | null;
  purpose: string;
  request_type: RequestType;
  request_date: string;
  date_of_use: string;
  time_of_use: string;
  expected_return_date: string | null;
  actual_return_date: string | null;
  status: RequestStatus;
  released_by: number | null;
  endorsed_by: number | null;
  approved_by: number | null;
  released_at: string | null;
  endorsed_at: string | null;
  approved_at: string | null;
  remarks: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  requestor?: Student | Personnel;
  laboratory?: Laboratory;
  area?: Area;
  course?: Course;
  facultyIncharge?: Personnel;
  releasedBy?: Personnel;
  endorsedBy?: Personnel;
  approvedBy?: Personnel;
  requested_equipments?: RequestFormItem[];
  items?: RequestFormItem[];
}

export interface StoreRequestFormPayload {
  requestor_id: number;
  requestor_type: "student" | "personnel";
  laboratory_id: number;
  area_id?: number | null;
  course_id?: number | null;
  faculty_incharge_id?: number | null;
  subject?: string | null;
  purpose: string;
  request_type: RequestType;
  request_date: string;
  date_of_use: string;
  time_of_use: string;
  expected_return_date?: string | null;
  remarks?: string | null;
  items: {
    equipment_id: number;
    quantity: number;
    unit: "pcs" | "set" | "unit";
    remarks?: string | null;
  }[];
}

export interface UpdateRequestFormPayload {
  area_id?: number | null;
  course_id?: number | null;
  faculty_incharge_id?: number | null;
  subject?: string | null;
  purpose?: string;
  request_type?: RequestType;
  request_date?: string;
  date_of_use?: string;
  time_of_use?: string;
  expected_return_date?: string | null;
  actual_return_date?: string | null;
  remarks?: string | null;
  items?: {
    equipment_id: number;
    quantity: number;
    unit: "pcs" | "set" | "unit";
    remarks?: string | null;
  }[];
}

export interface UpdateRequestFormStatusPayload {
  status: RequestStatus;
  released_by?: number | null;
  endorsed_by?: number | null;
  approved_by?: number | null;
  remarks?: string | null;
}

export interface LoadRequestFormsResponse {
  request_forms: PaginatedResponse<RequestForm>;
}

export interface RequestFormResponse {
  request_form: RequestForm;
  message: string;
}
