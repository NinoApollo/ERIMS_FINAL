// src/pages/Students/components/DeleteStudentFormModal.tsx

import { useEffect, useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import StudentService from "../../../services/StudentService";
import type { StudentColumns } from "../../../interfaces/StudentInterface";

interface DeleteStudentFormModalProps {
  student: StudentColumns | null;
  onStudentDeleted: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteStudentFormModal: FC<DeleteStudentFormModalProps> = ({
  student,
  onStudentDeleted,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const handleDestroyStudent = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingDestroy(true);

      const res = await StudentService.destroyStudent(student?.student_id!);

      if (res.status === 200) {
        onStudentDeleted(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected status error occurred during deleting student: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting student: ",
        error,
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    if (isOpen && student) {
      let name = `${student.last_name}, ${student.first_name}`;
      if (student.middle_name) {
        name += ` ${student.middle_name.charAt(0)}.`;
      }
      if (student.suffix_name) {
        name += ` ${student.suffix_name}`;
      }
      setFullName(name);
      setUsername(student.username);
    }
  }, [isOpen, student]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleDestroyStudent}>
        <h1 className="text-2xl border-b border-[#c9a84c]/20 pb-4 font-semibold mb-4 text-white">
          Delete Student Form
        </h1>
        <div className="grid grid-cols-1 gap-4 border-b border-[#c9a84c]/20 mb-4">
          <div className="mb-4">
            <label className="text-[#c9a84c]/70 text-xs font-semibold tracking-wider uppercase block mb-1">
              Student Name
            </label>
            <p className="text-slate-200 font-medium">{fullName}</p>
          </div>
          <div className="mb-4">
            <label className="text-[#c9a84c]/70 text-xs font-semibold tracking-wider uppercase block mb-1">
              Username
            </label>
            <p className="text-slate-200 font-medium">{username}</p>
          </div>
          <div className="mb-4">
            <p className="text-red-400 text-sm">
              ⚠️ Warning: This action cannot be undone. This will permanently
              delete the student record.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {!loadingDestroy && <CloseButton label="Close" onClose={onClose} />}
          <SubmitButton
            newClassName="px-4 py-3 bg-[#6B1E3C] hover:bg-[#7d2347] text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg shadow-[#6B1E3C]/30 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            label="Delete Student"
            loading={loadingDestroy}
            loadingLabel="Deleting Student..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default DeleteStudentFormModal;
