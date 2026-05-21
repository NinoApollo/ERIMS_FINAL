import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import MainPage from "../pages/Role/MainPage";
import EditRolePage from "../pages/Role/EditRolePage";
import DeleteRolePage from "../pages/Role/DeleteRolePage";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/roles/edit" element={<EditRolePage />} />
          <Route path="/roles/delete" element={<DeleteRolePage />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
