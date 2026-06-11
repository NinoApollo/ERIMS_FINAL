// src/services/RequestFormService.ts

import AxiosInstance from "./AxiosInstance";
import type {
  LoadRequestFormsResponse,
  RequestFormResponse,
  StoreRequestFormPayload,
  UpdateRequestFormPayload,
  UpdateRequestFormStatusPayload,
} from "../interfaces/RequestFormInterface";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  request_forms?: T;
  request_form?: T;
}

const RequestFormService = {
  loadRequestForms: async (
    page: number,
    search: string = "",
    status: string = "",
    requestType: string = "",
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (requestType) params.append("request_type", requestType);

      const response = await AxiosInstance.get<
        ApiResponse & LoadRequestFormsResponse
      >(`/request-form/loadRequestForms?${params.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  storeRequestForm: async (data: StoreRequestFormPayload) => {
    try {
      const response = await AxiosInstance.post<
        ApiResponse & RequestFormResponse
      >("/request-form/storeRequestForm", data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getRequestForm: async (requestId: string | number) => {
    try {
      const response = await AxiosInstance.get<
        ApiResponse & RequestFormResponse
      >(`/request-form/getRequestForm/${requestId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateRequestForm: async (
    requestId: string | number,
    data: UpdateRequestFormPayload | FormData,
  ) => {
    try {
      if (data instanceof FormData && !data.has("_method")) {
        data.append("_method", "PUT");
      }

      const response =
        data instanceof FormData
          ? await AxiosInstance.post<ApiResponse & RequestFormResponse>(
              `/request-form/updateRequestForm/${requestId}`,
              data,
            )
          : await AxiosInstance.put<ApiResponse & RequestFormResponse>(
              `/request-form/updateRequestForm/${requestId}`,
              data,
            );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateRequestFormStatus: async (
    requestId: string | number,
    data: UpdateRequestFormStatusPayload | FormData,
  ) => {
    try {
      if (data instanceof FormData && !data.has("_method")) {
        data.append("_method", "PUT");
      }

      const response =
        data instanceof FormData
          ? await AxiosInstance.post<ApiResponse & RequestFormResponse>(
              `/request-form/updateRequestFormStatus/${requestId}`,
              data,
            )
          : await AxiosInstance.put<ApiResponse & RequestFormResponse>(
              `/request-form/updateRequestFormStatus/${requestId}`,
              data,
            );
      return response;
    } catch (error) {
      throw error;
    }
  },

  destroyRequestForm: async (requestId: string | number) => {
    try {
      const response = await AxiosInstance.put<ApiResponse>(
        `/request-form/destroyRequestForm/${requestId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default RequestFormService;
