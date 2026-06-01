import AxiosInstance from "./AxiosInstance";

const CourseService = {
  loadCourses: async () => {
    try {
      const response = await AxiosInstance.get("/course/loadCourses");
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeCourse: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/course/storeCourse", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getCourse: async (courseId: string | number) => {
    try {
      const response = await AxiosInstance.get(`/course/getCourse/${courseId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateCourse: async (courseId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/course/updateCourse/${courseId}`,
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyCourse: async (courseId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/course/destroyCourse/${courseId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default CourseService;
