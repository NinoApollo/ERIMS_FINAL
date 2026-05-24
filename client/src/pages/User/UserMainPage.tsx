import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useToastMessage } from "../../hooks/useToastMessage";
import AddUserFormModal from "./components/AddUserFormModal";
import UserList from "./components/UserList";

const UserMainPage = () => {
  const { isOpen, openModal, closeModal } = useModal(false);
  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false);

  return (
    <div className="space-y-6 px-4 py-5 sm:px-6">
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <AddUserFormModal
        onUserAdded={showToastMessage}
        isOpen={isOpen}
        onClose={closeModal}
      />
      <UserList onAddUser={openModal} />
    </div>
  );
};

export default UserMainPage;
