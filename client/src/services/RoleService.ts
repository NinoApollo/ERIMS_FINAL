import AxiosInstance from "./AxiosInstance";

const RoleService = {
  storeRole: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/role/storeRole", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default RoleService;
