import { useEffect, useState } from "react";
import AddRoleForm from "./components/AddRoleForm";
import RoleList from "./components/RoleList";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

const RoleMainPage = () => {
  const [toastMessage, setToastMessage] = useState("");
  const [toastMessageIsVisible, setToastMessageIsVisible] = useState(false);

  const handleShowToastMessage = (message: string) => {
    setToastMessage(message);
    setToastMessageIsVisible(true);
  };

  const handleCloseToastMessage = () => {
    setToastMessage("");
    setToastMessageIsVisible(false);
  };

  useEffect(() => {
    document.title = "Role Main Page";
  }, []);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={handleCloseToastMessage}
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <AddRoleForm
            onRoleAdded={(message) => {
              handleShowToastMessage(message);
            }}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <RoleList />
        </div>
      </div>
    </>
  );
};

export default RoleMainPage;
