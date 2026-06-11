// src/services/ActivityLogService.ts

import AxiosInstance from "./AxiosInstance";
import type {
  ActivityLogFilters,
  ActivityLogResponse,
  ActivityLogStatsResponse,
  ClearLogsResponse,
  LoadActivityLogsResponse,
} from "../interfaces/ActivityLogInterface";

const ActivityLogService = {
  loadActivityLogs: async (page: number, filters: ActivityLogFilters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));

      if (filters.search) params.append("search", filters.search);
      if (filters.action) params.append("action", filters.action);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);
      if (filters.per_page) params.append("per_page", String(filters.per_page));

      const response = await AxiosInstance.get<LoadActivityLogsResponse>(
        `/activity-log/loadActivityLogs?${params.toString()}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getActivityLog: async (logId: string | number) => {
    try {
      const response = await AxiosInstance.get<ActivityLogResponse>(
        `/activity-log/getActivityLog/${logId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getActivityStats: async () => {
    try {
      const response = await AxiosInstance.get<ActivityLogStatsResponse>(
        "/activity-log/getActivityStats",
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  clearOldLogs: async (days: number = 30) => {
    try {
      const response = await AxiosInstance.delete<ClearLogsResponse>(
        `/activity-log/clearOldLogs?days=${days}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default ActivityLogService;
