import AxiosInstance from "./AxiosInstance";

const LaboratoryService = {
  loadLaboratories: async (page: number, search: string) => {
    try {
      const response = await AxiosInstance.get(
        search
          ? `/laboratory/loadLaboratories?page=${page}&search=${search}`
          : `/laboratory/loadLaboratories?page=${page}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeLaboratory: async (data: any) => {
    try {
      const response = await AxiosInstance.post(
        "/laboratory/storeLaboratory",
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getLaboratory: async (laboratoryId: string | number) => {
    try {
      const response = await AxiosInstance.get(
        `/laboratory/getLaboratory/${laboratoryId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateLaboratory: async (laboratoryId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/laboratory/updateLaboratory/${laboratoryId}`,
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyLaboratory: async (laboratoryId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/laboratory/destroyLaboratory/${laboratoryId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default LaboratoryService;
