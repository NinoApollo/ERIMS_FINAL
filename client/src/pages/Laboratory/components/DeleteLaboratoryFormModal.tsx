import { useEffect, useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import LaboratoryService from "../../../services/LaboratoryService";
import type { LaboratoryColumns } from "../../../interfaces/LaboratoryInterface";

interface DeleteLaboratoryFormModalProps {
  laboratory: LaboratoryColumns | null;
  onLaboratoryDeleted: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteLaboratoryFormModal: FC<DeleteLaboratoryFormModalProps> = ({
  laboratory,
  onLaboratoryDeleted,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [laboratoryName, setLaboratoryName] = useState("");

  const handleDestroyLaboratory = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingDestroy(true);

      const res = await LaboratoryService.destroyLaboratory(
        laboratory?.laboratory_id!,
      );

      if (res.status === 200) {
        onLaboratoryDeleted(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected status error occurred during deleting laboratory: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting laboratory: ",
        error,
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (laboratory) {
        setLaboratoryName(laboratory.laboratory);
      } else {
        console.error(
          "Unexpected laboratory error occurred during getting laboratory details: ",
          laboratory,
        );
      }
    }
  }, [isOpen, laboratory]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleDestroyLaboratory}>
          <h1 className="text-2xl border-b border-[#c9a84c]/20 p-4 font-semibold mb-4 text-white">
            Delete Laboratory
          </h1>
          <div className="grid grid-cols-1 gap-4 border-b border-[#c9a84c]/20 mb-4">
            <div className="mb-4">
              <label
                htmlFor="laboratory"
                className="text-[#c9a84c]/70 text-xs font-semibold tracking-wider uppercase block mb-1"
              >
                Laboratory
              </label>
              <p className="text-slate-200 font-medium">{laboratoryName}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <CloseButton label="Close" onClose={onClose} />}
            <SubmitButton
              newClassName="px-4 py-3 bg-[#6B1E3C] hover:bg-[#7d2347] text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg shadow-[#6B1E3C]/30 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              label="Delete Laboratory"
              loading={loadingDestroy}
              loadingLabel="Deleting Laboratory..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DeleteLaboratoryFormModal;
