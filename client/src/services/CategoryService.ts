import AxiosInstance from "./AxiosInstance";

const CategoryService = {
  loadCategories: async () => {
    try {
      const response = await AxiosInstance.get("/category/loadCategories");
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeCategory: async (data: any) => {
    try {
      const response = await AxiosInstance.post(
        "/category/storeCategory",
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getCategory: async (categoryId: string | number) => {
    try {
      const response = await AxiosInstance.get(
        `/category/getCategory/${categoryId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateCategory: async (categoryId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/category/updateCategory/${categoryId}`,
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyCategory: async (categoryId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/category/destroyCategory/${categoryId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default CategoryService;
