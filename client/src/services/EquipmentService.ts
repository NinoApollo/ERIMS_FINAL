// src/services/EquipmentService.ts

import AxiosInstance from "./AxiosInstance";
import type {
  EquipmentColumns,
  StoreEquipmentPayload,
  UpdateEquipmentPayload,
} from "../interfaces/EquipmentInterface";

interface LoadEquipmentsResponse {
  equipments: {
    data: EquipmentColumns[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface EquipmentResponse {
  equipment: EquipmentColumns;
  message?: string;
}

const EquipmentService = {
  loadEquipments: async (page: number, search: string) => {
    try {
      const response = await AxiosInstance.get<LoadEquipmentsResponse>(
        search
          ? `/equipment/loadEquipments?page=${page}&search=${search}`
          : `/equipment/loadEquipments?page=${page}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  storeEquipment: async (data: StoreEquipmentPayload | FormData) => {
    try {
      const response = await AxiosInstance.post<EquipmentResponse>(
        "/equipment/storeEquipment",
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getEquipment: async (equipmentId: string | number) => {
    try {
      const response = await AxiosInstance.get<EquipmentResponse>(
        `/equipment/getEquipment/${equipmentId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateEquipment: async (
    equipmentId: string | number,
    data: UpdateEquipmentPayload | FormData,
  ) => {
    try {
      if (data instanceof FormData && !data.has("_method")) {
        data.append("_method", "PUT");
      }

      const response =
        data instanceof FormData
          ? await AxiosInstance.post<EquipmentResponse>(
              `/equipment/updateEquipment/${equipmentId}`,
              data,
            )
          : await AxiosInstance.put<EquipmentResponse>(
              `/equipment/updateEquipment/${equipmentId}`,
              data,
            );
      return response;
    } catch (error) {
      throw error;
    }
  },

  destroyEquipment: async (equipmentId: string | number) => {
    try {
      const response = await AxiosInstance.put<{ message: string }>(
        `/equipment/destroyEquipment/${equipmentId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default EquipmentService;
