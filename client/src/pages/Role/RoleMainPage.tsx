import { useEffect } from "react";
import AddRoleForm from "./components/AddRoleForm";
import RoleList from "./components/RoleList";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useRefresh } from "../../hooks/useRefresh";
import { useLocation } from "react-router-dom";

const RoleMainPage = () => {
  const location = useLocation();

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false);

  const { refresh, handleRefresh } = useRefresh(false);

  useEffect(() => {
    document.title = "Role Main Page";
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      showToastMessage(location.state.message);
      handleRefresh();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showToastMessage]);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-2 md:col-span-1">
          <AddRoleForm
            onRoleAdded={showToastMessage}
            refreshKey={handleRefresh}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <RoleList refreshKey={refresh} />
        </div>
      </div>
    </>
  );
};

export default RoleMainPage;
