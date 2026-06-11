import AxiosInstance from "./AxiosInstance";

const AreaService = {
  loadAreas: async (page: number, search: string) => {
    try {
      const response = await AxiosInstance.get(
        search
          ? `/area/loadAreas?page=${page}&search=${search}`
          : `/area/loadAreas?page=${page}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeArea: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/area/storeArea", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getArea: async (areaId: string | number) => {
    try {
      const response = await AxiosInstance.get(`/area/getArea/${areaId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateArea: async (areaId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/area/updateArea/${areaId}`,
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyArea: async (areaId: string | number) => {
    try {
      const response = await AxiosInstance.put(`/area/destroyArea/${areaId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default AreaService;
