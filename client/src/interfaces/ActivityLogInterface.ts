// src/interfaces/ActivityLogInterface.ts

import type { PaginatedResponse } from "./SharedInterfaces";

export interface ActivityLogColumns {
  log_id: number;
  student_id: number | null;
  personnel_id: number | null;
  request_id: number | null;
  action: string;
  description: string | null;
  ip_address: string | null;
  user_agent: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  student?: {
    student_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix_name: string | null;
  };
  personnel?: {
    personnel_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix_name: string | null;
    role?: {
      role_id: number;
      role: string;
    };
  };
  request_form?: {
    request_id: number;
    request_number: string;
  };
}

export interface ActivityLogStats {
  total_logs: number;
  by_action: Array<{
    action: string;
    count: number;
  }>;
  today_logs: number;
  this_week_logs: number;
}

export interface LoadActivityLogsResponse {
  activity_logs: PaginatedResponse<ActivityLogColumns>;
}

export interface ActivityLogResponse {
  activity_log: ActivityLogColumns;
}

export interface ActivityLogStatsResponse {
  stats: ActivityLogStats;
}

export interface ClearLogsResponse {
  message: string;
  deleted_count: number;
}

export interface ActivityLogFilters {
  search?: string;
  action?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
}
