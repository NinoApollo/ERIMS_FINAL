// src/pages/Students/StudentMainPage.tsx

import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import AddStudentFormModal from "./components/AddStudentFormModal";
import EditStudentFormModal from "./components/EditStudentFormModal";
import DeleteStudentFormModal from "./components/DeleteStudentFormModal";
import StudentList from "./components/StudentList";
import type { StudentColumns } from "../../interfaces/StudentInterface";

const StudentMainPage = () => {
  useEffect(() => {
    document.title = "Student Management";
  }, []);

  const {
    isOpen: isAddStudentFormModalOpen,
    openModal: openAddStudentFormModal,
    closeModal: closeAddStudentFormModal,
  } = useModal(false);

  const {
    isOpen: isEditStudentFormModalOpen,
    selectedUser: selectedStudentForEdit,
    openModal: openEditStudentFormModal,
    closeModal: closeEditStudentFormModal,
  } = useModal(false);

  const {
    isOpen: isDeleteStudentFormModalOpen,
    selectedUser: selectedStudentForDelete,
    openModal: openDeleteStudentFormModal,
    closeModal: closeDeleteStudentFormModal,
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

      <AddStudentFormModal
        onStudentAdded={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isAddStudentFormModalOpen}
        onClose={closeAddStudentFormModal}
      />

      <EditStudentFormModal
        student={selectedStudentForEdit as StudentColumns | null}
        onStudentUpdated={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isEditStudentFormModalOpen}
        onClose={closeEditStudentFormModal}
      />

      <DeleteStudentFormModal
        student={selectedStudentForDelete as StudentColumns | null}
        onStudentDeleted={showToastMessage}
        refreshKey={handleRefresh}
        isOpen={isDeleteStudentFormModalOpen}
        onClose={closeDeleteStudentFormModal}
      />

      <StudentList
        onAddStudent={openAddStudentFormModal}
        onEditStudent={(student) => openEditStudentFormModal(student as any)}
        onDeleteStudent={(student) =>
          openDeleteStudentFormModal(student as any)
        }
        refreshKey={refresh}
      />
    </>
  );
};

export default StudentMainPage;
