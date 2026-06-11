// src/pages/Personnels/components/DeletePersonnelFormModal.tsx

import { useEffect, useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import PersonnelService from "../../../services/PersonnelService";
import type { PersonnelColumns } from "../../../interfaces/PersonnelInterface";

interface DeletePersonnelFormModalProps {
  personnel: PersonnelColumns | null;
  onPersonnelDeleted: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const DeletePersonnelFormModal: FC<DeletePersonnelFormModalProps> = ({
  personnel,
  onPersonnelDeleted,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  const handleDestroyPersonnel = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingDestroy(true);

      const res = await PersonnelService.destroyPersonnel(
        personnel?.personnel_id!,
      );

      if (res.status === 200) {
        onPersonnelDeleted(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected status error occurred during deleting personnel: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting personnel: ",
        error,
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    if (isOpen && personnel) {
      let name = `${personnel.last_name}, ${personnel.first_name}`;
      if (personnel.middle_name) {
        name += ` ${personnel.middle_name.charAt(0)}.`;
      }
      if (personnel.suffix_name) {
        name += ` ${personnel.suffix_name}`;
      }
      setFullName(name);
      setRole(personnel.role?.role || "N/A");
      setUsername(personnel.username);
    }
  }, [isOpen, personnel]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleDestroyPersonnel}>
        <h1 className="text-2xl border-b border-[#c9a84c]/20 pb-4 font-semibold mb-4 text-white">
          Delete Personnel Form
        </h1>
        <div className="grid grid-cols-1 gap-4 border-b border-[#c9a84c]/20 mb-4">
          <div className="mb-4">
            <label className="text-[#c9a84c]/70 text-xs font-semibold tracking-wider uppercase block mb-1">
              Personnel Name
            </label>
            <p className="text-slate-200 font-medium">{fullName}</p>
          </div>
          <div className="mb-4">
            <label className="text-[#c9a84c]/70 text-xs font-semibold tracking-wider uppercase block mb-1">
              Role
            </label>
            <p className="text-slate-200 font-medium">{role}</p>
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
              delete the personnel record.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {!loadingDestroy && <CloseButton label="Close" onClose={onClose} />}
          <SubmitButton
            newClassName="px-4 py-3 bg-[#6B1E3C] hover:bg-[#7d2347] text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg shadow-[#6B1E3C]/30 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            label="Delete Personnel"
            loading={loadingDestroy}
            loadingLabel="Deleting Personnel..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default DeletePersonnelFormModal;
