import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import type { GenderColumns } from "../../interfaces/GenderInterface";
import EditGenderFormModal from "./components/EditGenderFormModal";
import DeleteGenderFormModal from "./components/DeleteGenderFormModal";
import AddGenderForm from "./components/AddGenderForm";
import GenderList from "./components/GenderList";

const GenderMainPage = () => {
  useEffect(() => {
    document.title = "Gender Main Page";
  }, []);

  const {
    isOpen: isEditGenderFormModalOpen,
    selectedUser: selectedGenderForEdit,
    openModal: openEditGenderFormModal,
    closeModal: closeEditGenderFormModal,
  } = useModal(false);

  const {
    isOpen: isDeleteGenderFormModalOpen,
    selectedUser: selectedGenderForDelete,
    openModal: openDeleteGenderFormModal,
    closeModal: closeDeleteGenderFormModal,
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
      <EditGenderFormModal
        gender={selectedGenderForEdit as GenderColumns | null}
        onGenderUpdated={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isEditGenderFormModalOpen}
        onClose={closeEditGenderFormModal}
      />
      <DeleteGenderFormModal
        gender={selectedGenderForDelete as GenderColumns | null}
        onGenderDeleted={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isDeleteGenderFormModalOpen}
        onClose={closeDeleteGenderFormModal}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-2 md:col-span-1">
          <AddGenderForm
            onGenderAdded={showToastMessage}
            refreshKey={handleRefresh}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <GenderList
            onEditGender={(gender) => openEditGenderFormModal(gender as any)}
            onDeleteGender={(gender) =>
              openDeleteGenderFormModal(gender as any)
            }
            refreshKey={refresh}
          />
        </div>
      </div>
    </>
  );
};

export default GenderMainPage;
