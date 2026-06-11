import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import type { EquipmentColumns } from "../../interfaces/EquipmentInterface";
import AddEquipmentFormModal from "./components/AddEquipmentFormModal";
import EditEquipmentFormModal from "./components/EditEquipmentFormModal";
import DeleteEquipmentFormModal from "./components/DeleteEquipmentFormModal";
import EquipmentList from "./components/EquipmentList";

const EquipmentMainPage = () => {
  useEffect(() => {
    document.title = "Equipment Main Page";
  }, []);

  const {
    isOpen: isAddEquipmentFormModalOpen,
    openModal: openAddEquipmentFormModal,
    closeModal: closeAddEquipmentFormModal,
  } = useModal(false);

  const {
    isOpen: isEditEquipmentFormModalOpen,
    selectedUser: selectedEquipmentForEdit,
    openModal: openEditEquipmentFormModal,
    closeModal: closeEditEquipmentFormModal,
  } = useModal(false);

  const {
    isOpen: isDeleteEquipmentFormModalOpen,
    selectedUser: selectedEquipmentForDelete,
    openModal: openDeleteEquipmentFormModal,
    closeModal: closeDeleteEquipmentFormModal,
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
      <AddEquipmentFormModal
        onEquipmentAdded={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isAddEquipmentFormModalOpen}
        onClose={closeAddEquipmentFormModal}
      />
      <EditEquipmentFormModal
        equipment={selectedEquipmentForEdit as EquipmentColumns | null}
        onEquipmentUpdated={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isEditEquipmentFormModalOpen}
        onClose={closeEditEquipmentFormModal}
      />
      <DeleteEquipmentFormModal
        equipment={selectedEquipmentForDelete as EquipmentColumns | null}
        onEquipmentDeleted={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isDeleteEquipmentFormModalOpen}
        onClose={closeDeleteEquipmentFormModal}
      />
      <EquipmentList
        onAddEquipment={openAddEquipmentFormModal}
        onEditEquipment={(equipment) =>
          openEditEquipmentFormModal(equipment as any)
        }
        onDeleteEquipment={(equipment) =>
          openDeleteEquipmentFormModal(equipment as any)
        }
        refreshKey={refresh}
      />
    </>
  );
};

export default EquipmentMainPage;
