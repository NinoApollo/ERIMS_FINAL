import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import LaboratoryService from "../../../services/LaboratoryService";
import type {
  LaboratoryColumns,
  LaboratoryFieldErrors,
} from "../../../interfaces/LaboratoryInterface";

interface EditLaboratoryFormModalProps {
  laboratory: LaboratoryColumns | null;
  onLaboratoryUpdated: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditLaboratoryFormModal: FC<EditLaboratoryFormModalProps> = ({
  laboratory,
  onLaboratoryUpdated,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [laboratoryName, setLaboratoryName] = useState("");
  const [errors, setErrors] = useState<LaboratoryFieldErrors>({
    laboratory: [],
  });

  const handleUpdateLaboratory = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await LaboratoryService.updateLaboratory(
        laboratory?.laboratory_id!,
        { laboratory: laboratoryName },
      );

      if (res.status === 200) {
        setLaboratoryName(res.data.laboratory.laboratory);
        setErrors({ laboratory: [] });
        onLaboratoryUpdated(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected status error occurred during updating laboratory: ",
          res.status,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating laboratory: ",
          error,
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (laboratory) {
        setLaboratoryName(laboratory.laboratory);
        setErrors({ laboratory: [] });
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
        <form onSubmit={handleUpdateLaboratory} className="space-y-6">
          <div className="border-b border-[#c9a84c]/20 pb-4">
            <h1 className="text-2xl font-semibold text-white">
              Edit Laboratory
            </h1>
            <p className="mt-2 text-sm text-[#c9a84c]/60">
              Update the laboratory information below.
            </p>
          </div>
          <div className="space-y-4">
            <FloatingLabelInput
              label="Laboratory"
              type="text"
              name="laboratory"
              value={laboratoryName}
              onChange={(e) => setLaboratoryName(e.target.value)}
              required
              autoFocus
              errors={errors.laboratory}
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-[#c9a84c]/20 pt-4">
            {!loadingUpdate && <CloseButton label="Close" onClose={onClose} />}
            <SubmitButton
              label="Update Laboratory"
              loading={loadingUpdate}
              loadingLabel="Updating Laboratory..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditLaboratoryFormModal;
