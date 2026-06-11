// src/services/PersonnelService.ts

import AxiosInstance from "./AxiosInstance";
import type {
  LoadPersonnelsResponse,
  StorePersonnelPayload,
  PersonnelMessageResponse,
  PersonnelResponse,
  UpdatePersonnelPayload,
} from "../interfaces/PersonnelInterface";

const PersonnelService = {
  loadPersonnels: async (page: number, search: string) => {
    try {
      const response = await AxiosInstance.get<LoadPersonnelsResponse>(
        search
          ? `/personnel/loadPersonnels?page=${page}&search=${search}`
          : `/personnel/loadPersonnels?page=${page}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  storePersonnel: async (data: StorePersonnelPayload | FormData) => {
    try {
      const response = await AxiosInstance.post<PersonnelMessageResponse>(
        "/personnel/storePersonnel",
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getPersonnel: async (personnelId: string | number) => {
    try {
      const response = await AxiosInstance.get<PersonnelResponse>(
        `/personnel/getPersonnel/${personnelId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updatePersonnel: async (
    personnelId: string | number,
    data: UpdatePersonnelPayload | FormData,
  ) => {
    try {
      if (data instanceof FormData && !data.has("_method")) {
        data.append("_method", "PUT");
      }

      const response =
        data instanceof FormData
          ? await AxiosInstance.post<PersonnelMessageResponse>(
              `/personnel/updatePersonnel/${personnelId}`,
              data,
            )
          : await AxiosInstance.put<PersonnelMessageResponse>(
              `/personnel/updatePersonnel/${personnelId}`,
              data,
            );
      return response;
    } catch (error) {
      throw error;
    }
  },

  destroyPersonnel: async (personnelId: string | number) => {
    try {
      const response = await AxiosInstance.put<PersonnelMessageResponse>(
        `/personnel/destroyPersonnel/${personnelId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default PersonnelService;
