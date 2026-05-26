import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import UserMainPage from "../pages/User/UserMainPage";
import RoleMainPage from "../pages/Role/RoleMainPage";
import EditRolePage from "../pages/Role/EditRolePage";
import DeleteRolePage from "../pages/Role/DeleteRolePage";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RoleMainPage />} />
          <Route path="/gender/edit/:gender_id" element={<EditRolePage />} />
          <Route
            path="/gender/delete/:gender_id"
            element={<DeleteRolePage />}
          />
          <Route path="/users" element={<UserMainPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
