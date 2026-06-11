// src/pages/Personnels/PersonnelMainPage.tsx

import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import type { PersonnelColumns } from "../../interfaces/PersonnelInterface";
import AddPersonnelFormModal from "./components/AddPersonnelFormModal";
import EditPersonnelFormModal from "./components/EditPersonnelFormModal";
import DeletePersonnelFormModal from "./components/DeletePersonnelFormModal";
import PersonnelList from "./components/PersonnelList";

const PersonnelMainPage = () => {
  useEffect(() => {
    document.title = "Personnel Management";
  }, []);

  const {
    isOpen: isAddPersonnelFormModalOpen,
    openModal: openAddPersonnelFormModal,
    closeModal: closeAddPersonnelFormModal,
  } = useModal(false);

  const {
    isOpen: isEditPersonnelFormModalOpen,
    selectedUser: selectedPersonnelForEdit,
    openModal: openEditPersonnelFormModal,
    closeModal: closeEditPersonnelFormModal,
  } = useModal(false);

  const {
    isOpen: isDeletePersonnelFormModalOpen,
    selectedUser: selectedPersonnelForDelete,
    openModal: openDeletePersonnelFormModal,
    closeModal: closeDeletePersonnelFormModal,
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

      <AddPersonnelFormModal
        onPersonnelAdded={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isAddPersonnelFormModalOpen}
        onClose={closeAddPersonnelFormModal}
      />

      <EditPersonnelFormModal
        personnel={selectedPersonnelForEdit as PersonnelColumns | null}
        onPersonnelUpdated={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isEditPersonnelFormModalOpen}
        onClose={closeEditPersonnelFormModal}
      />

      <DeletePersonnelFormModal
        personnel={selectedPersonnelForDelete as PersonnelColumns | null}
        onPersonnelDeleted={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isDeletePersonnelFormModalOpen}
        onClose={closeDeletePersonnelFormModal}
      />

      <PersonnelList
        onAddPersonnel={openAddPersonnelFormModal}
        onEditPersonnel={(personnel: PersonnelColumns | null) =>
          openEditPersonnelFormModal(personnel)
        }
        onDeletePersonnel={(personnel: PersonnelColumns | null) =>
          openDeletePersonnelFormModal(personnel)
        }
        refreshKey={refresh}
      />
    </>
  );
};

export default PersonnelMainPage;
