import AxiosInstance from "./AxiosInstance";
import type {
  LoadStudentsResponse,
  StoreStudentPayload,
  StudentMessageResponse,
  StudentResponse,
  UpdateStudentPayload,
} from "../interfaces/StudentInterface";

const StudentService = {
  loadStudents: async (page: number, search: string) => {
    try {
      const response = await AxiosInstance.get<LoadStudentsResponse>(
        search
          ? `/student/loadStudents?page=${page}&search=${search}`
          : `/student/loadStudents?page=${page}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  storeStudent: async (data: StoreStudentPayload | FormData) => {
    try {
      const response = await AxiosInstance.post<StudentMessageResponse>(
        "/student/storeStudent",
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  getStudent: async (studentId: string | number) => {
    try {
      const response = await AxiosInstance.get<StudentResponse>(
        `/student/getStudent/${studentId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateStudent: async (
    studentId: string | number,
    data: UpdateStudentPayload | FormData,
  ) => {
    try {
      if (data instanceof FormData && !data.has("_method")) {
        data.append("_method", "PUT");
      }

      const response =
        data instanceof FormData
          ? await AxiosInstance.post<StudentMessageResponse>(
              `/student/updateStudent/${studentId}`,
              data,
            )
          : await AxiosInstance.put<StudentMessageResponse>(
              `/student/updateStudent/${studentId}`,
              data,
            );
      return response;
    } catch (error) {
      throw error;
    }
  },

  destroyStudent: async (studentId: string | number) => {
    try {
      const response = await AxiosInstance.put<StudentMessageResponse>(
        `/student/destroyStudent/${studentId}`,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default StudentService;
