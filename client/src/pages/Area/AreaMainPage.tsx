import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import EditAreaFormModal from "./components/EditAreaFormModal";
import DeleteAreaFormModal from "./components/DeleteAreaFormModal";
import type { AreaColumns } from "../../interfaces/AreaInterface";
import AddAreaForm from "./components/AddAreaForm";
import AreaList from "./components/AreaList";

const AreaMainPage = () => {
  useEffect(() => {
    document.title = "Area Main Page";
  }, []);

  const {
    isOpen: isEditAreaFormModalOpen,
    selectedUser: selectedAreaForEdit,
    openModal: openEditAreaFormModal,
    closeModal: closeEditAreaFormModal,
  } = useModal(false);

  const {
    isOpen: isDeleteAreaFormModalOpen,
    selectedUser: selectedAreaForDelete,
    openModal: openDeleteAreaFormModal,
    closeModal: closeDeleteAreaFormModal,
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
      <EditAreaFormModal
        area={selectedAreaForEdit as AreaColumns | null}
        onAreaUpdated={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isEditAreaFormModalOpen}
        onClose={closeEditAreaFormModal}
      />
      <DeleteAreaFormModal
        area={selectedAreaForDelete as AreaColumns | null}
        onAreaDeleted={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isDeleteAreaFormModalOpen}
        onClose={closeDeleteAreaFormModal}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-2 md:col-span-1">
          <AddAreaForm
            onAreaAdded={showToastMessage}
            refreshKey={handleRefresh}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <AreaList
            onEditArea={(area) => openEditAreaFormModal(area as any)}
            onDeleteArea={(area) => openDeleteAreaFormModal(area as any)}
            refreshKey={refresh}
          />
        </div>
      </div>
    </>
  );
};

export default AreaMainPage;
