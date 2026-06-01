import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import AddLaboratoryForm from "./components/AddLaboratoryForm";
import LaboratoryList from "./components/LaboratoryList";
import EditLaboratoryFormModal from "./components/EditLaboratoryFormModal";
import DeleteLaboratoryFormModal from "./components/DeleteLaboratoryFormModal";
import type { LaboratoryColumns } from "../../interfaces/LaboratoryInterface";

const LaboratoryMainPage = () => {
  useEffect(() => {
    document.title = "Laboratory Main Page";
  }, []);

  const {
    isOpen: isEditLaboratoryFormModalOpen,
    selectedUser: selectedLaboratoryForEdit,
    openModal: openEditLaboratoryFormModal,
    closeModal: closeEditLaboratoryFormModal,
  } = useModal(false);

  const {
    isOpen: isDeleteLaboratoryFormModalOpen,
    selectedUser: selectedLaboratoryForDelete,
    openModal: openDeleteLaboratoryFormModal,
    closeModal: closeDeleteLaboratoryFormModal,
  } = useModal(false);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  const { refresh, handleRefresh } = useRefresh(false);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <EditLaboratoryFormModal
        laboratory={selectedLaboratoryForEdit as LaboratoryColumns | null}
        onLaboratoryUpdated={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isEditLaboratoryFormModalOpen}
        onClose={closeEditLaboratoryFormModal}
      />
      <DeleteLaboratoryFormModal
        laboratory={selectedLaboratoryForDelete as LaboratoryColumns | null}
        onLaboratoryDeleted={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isDeleteLaboratoryFormModalOpen}
        onClose={closeDeleteLaboratoryFormModal}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-2 md:col-span-1">
          <AddLaboratoryForm
            onLaboratoryAdded={showToastMessage}
            refreshKey={handleRefresh}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <LaboratoryList
            onEditLaboratory={(laboratory) =>
              openEditLaboratoryFormModal(laboratory as any)
            }
            onDeleteLaboratory={(laboratory) =>
              openDeleteLaboratoryFormModal(laboratory as any)
            }
            refreshKey={refresh}
          />
        </div>
      </div>
    </>
  );
};

export default LaboratoryMainPage;
