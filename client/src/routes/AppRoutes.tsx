import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import UserMainPage from "../pages/User/UserMainPage";
import RoleMainPage from "../pages/Role/RoleMainPage";
import EditRolePage from "../pages/Role/EditRolePage";
import DeleteRolePage from "../pages/Role/DeleteRolePage";
import DashboardMainPage from "../pages/Dashboard/DashboardMainPage";
import LoginPage from "../pages/Auth/LoginPage";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import CourseMainPage from "../pages/Course/CourseMainPage";
import EditCoursePage from "../pages/Course/EditCoursePage";
import DeleteCoursePage from "../pages/Course/DeleteCoursePage";
import CategoryMainPage from "../pages/Category/CategoryMainPage";
import EditCategoryPage from "../pages/Category/EditCategoryPage";
import DeleteCategoryPage from "../pages/Category/DeleteCategoryPage";
import LaboratoryMainPage from "../pages/Laboratory/LaboratoryMainPage";

const AppRoutes = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardMainPage />} />
            <Route path="/roles" element={<RoleMainPage />} />
            <Route path="/role/edit/:role_id" element={<EditRolePage />} />
            <Route path="/role/delete/:role_id" element={<DeleteRolePage />} />
            <Route path="/courses" element={<CourseMainPage />} />
            <Route
              path="/course/edit/:course_id"
              element={<EditCoursePage />}
            />
            <Route
              path="/course/delete/:course_id"
              element={<DeleteCoursePage />}
            />
            <Route path="/categories" element={<CategoryMainPage />} />
            <Route
              path="/category/edit/:category_id"
              element={<EditCategoryPage />}
            />
            <Route
              path="/category/delete/:category_id"
              element={<DeleteCategoryPage />}
            />
            <Route path="/users" element={<UserMainPage />} />
            <Route path="/laboratories" element={<LaboratoryMainPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
};

export default AppRoutes;
