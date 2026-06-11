// src/pages/RequestForm/RequestFormMainPage.tsx

import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import AddRequestFormModal from "./components/AddRequestFormModal";
import RequestFormList from "./components/RequestFormList";
import EditRequestFormModal from "./components/EditRequestFormModal";
import DeleteRequestFormModal from "./components/DeleteRequestFormModal";
import ShowRequestFormModal from "./components/ShowRequestFormModal";
import type { RequestForm } from "../../interfaces/RequestFormInterface";

const RequestFormMainPage = () => {
  useEffect(() => {
    document.title = "Request Form Management";
  }, []);

  const {
    isOpen: isAddRequestFormModalOpen,
    openModal: openAddRequestFormModal,
    closeModal: closeAddRequestFormModal,
  } = useModal(false);

  const {
    isOpen: isEditRequestFormModalOpen,
    selectedUser: selectedRequestFormForEdit,
    openModal: openEditRequestFormModal,
    closeModal: closeEditRequestFormModal,
  } = useModal(false);

  const {
    isOpen: isDeleteRequestFormModalOpen,
    selectedUser: selectedRequestFormForDelete,
    openModal: openDeleteRequestFormModal,
    closeModal: closeDeleteRequestFormModal,
  } = useModal(false);

  const {
    isOpen: isShowRequestFormModalOpen,
    selectedUser: selectedRequestFormForShow,
    openModal: openShowRequestFormModal,
    closeModal: closeShowRequestFormModal,
  } = useModal(false);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  const { refresh, handleRefresh } = useRefresh(false);

  // Helper to safely get request form data
  const getRequestFormData = (requestForm: any): RequestForm | null => {
    if (!requestForm) return null;
    return requestForm as RequestForm;
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#0E1A3A] via-[#1C2B5E] to-[#0E1A3A]">
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />

      <AddRequestFormModal
        onRequestFormAdded={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isAddRequestFormModalOpen}
        onClose={closeAddRequestFormModal}
      />

      <EditRequestFormModal
        requestForm={getRequestFormData(selectedRequestFormForEdit)}
        onRequestFormUpdated={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isEditRequestFormModalOpen}
        onClose={() => {
          closeEditRequestFormModal();
          handleRefresh();
        }}
      />

      <DeleteRequestFormModal
        requestForm={getRequestFormData(selectedRequestFormForDelete)}
        onRequestFormDeleted={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isDeleteRequestFormModalOpen}
        onClose={closeDeleteRequestFormModal}
      />

      <ShowRequestFormModal
        requestForm={getRequestFormData(selectedRequestFormForShow)}
        isOpen={isShowRequestFormModalOpen}
        onClose={closeShowRequestFormModal}
        onEdit={() => {
          closeShowRequestFormModal();
          setTimeout(() => {
            openEditRequestFormModal(selectedRequestFormForShow);
          }, 100);
        }}
      />

      <div className="space-y-6">
        <RequestFormList
          onAddRequestForm={openAddRequestFormModal}
          onShowRequestForm={(requestForm) => {
            openShowRequestFormModal(requestForm);
          }}
          onEditRequestForm={(requestForm) => {
            openEditRequestFormModal(requestForm);
          }}
          onDeleteRequestForm={(requestForm) => {
            openDeleteRequestFormModal(requestForm);
          }}
          refreshKey={refresh}
        />
      </div>
    </div>
  );
};

export default RequestFormMainPage;
