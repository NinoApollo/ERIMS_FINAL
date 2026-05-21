import { useEffect } from "react";
import AddRoleForm from "./components/AddRoleForm";
import RoleList from "./components/RoleList";

const MainPage = () => {
  useEffect(() => {
    document.title = "Role Main Page";
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <AddRoleForm />
        </div>
        <div className="col-span-2 md:col-span-1">
          <RoleList />
        </div>
      </div>
    </>
  );
};

export default MainPage;
