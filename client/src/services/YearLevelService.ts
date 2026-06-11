import AxiosInstance from "./AxiosInstance";

const YearLevelService = {
  loadYearLevels: async () => {
    try {
      const response = await AxiosInstance.get("/year-level/loadYearLevels");
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeYearLevel: async (data: any) => {
    try {
      const response = await AxiosInstance.post(
        "/year-level/storeYearLevel",
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getYearLevel: async (yearLevelId: string | number) => {
    try {
      const response = await AxiosInstance.get(
        `/year-level/getYearLevel/${yearLevelId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateYearLevel: async (yearLevelId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/year-level/updateYearLevel/${yearLevelId}`,
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyYearLevel: async (yearLevelId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/year-level/destroyYearLevel/${yearLevelId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default YearLevelService;
