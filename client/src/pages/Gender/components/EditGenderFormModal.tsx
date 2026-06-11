import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import type {
  GenderColumns,
  GenderFieldErrors,
} from "../../../interfaces/GenderInterface";
import GenderService from "../../../services/GenderService";

interface EditGenderFormModalProps {
  gender: GenderColumns | null;
  onGenderUpdated: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditGenderFormModal: FC<EditGenderFormModalProps> = ({
  gender,
  onGenderUpdated,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [genderName, setGenderName] = useState("");
  const [errors, setErrors] = useState<GenderFieldErrors>({
    gender: [],
  });

  const handleUpdateGender = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await GenderService.updateGender(gender?.gender_id!, {
        gender: genderName,
      });

      if (res.status === 200) {
        setGenderName(res.data.gender.gender);
        setErrors({ gender: [] });
        onGenderUpdated(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected status error occurred during updating gender: ",
          res.status,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating gender: ",
          error,
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (gender) {
        setGenderName(gender.gender);
        setErrors({ gender: [] });
      } else {
        console.error(
          "Unexpected gender error occurred during getting gender details: ",
          gender,
        );
      }
    }
  }, [isOpen, gender]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleUpdateGender} className="space-y-6">
          <div className="border-b border-[#c9a84c]/20 pb-4">
            <h1 className="text-2xl font-semibold text-white">Edit Gender</h1>
            <p className="mt-2 text-sm text-[#c9a84c]/60">
              Update the gender information below.
            </p>
          </div>
          <div className="space-y-4">
            <FloatingLabelInput
              label="Gender"
              type="text"
              name="gender"
              value={genderName}
              onChange={(e) => setGenderName(e.target.value)}
              required
              autoFocus
              errors={errors.gender}
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-[#c9a84c]/20 pt-4">
            {!loadingUpdate && <CloseButton label="Close" onClose={onClose} />}
            <SubmitButton
              label="Update Gender"
              loading={loadingUpdate}
              loadingLabel="Updating Gender..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditGenderFormModal;
