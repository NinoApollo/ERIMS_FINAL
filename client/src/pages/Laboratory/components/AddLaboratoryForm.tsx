import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { LaboratoryFieldErrors } from "../../../interfaces/LaboratoryInterface";
import LaboratoryService from "../../../services/LaboratoryService";

interface AddLaboratoryFormProps {
  onLaboratoryAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddLaboratoryForm: FC<AddLaboratoryFormProps> = ({
  onLaboratoryAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [laboratory, setLaboratory] = useState("");
  const [errors, setErrors] = useState<LaboratoryFieldErrors>({
    laboratory: [],
  });

  const handleStoreLaboratory = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await LaboratoryService.storeLaboratory({
        laboratory,
      });

      if (res.status === 200) {
        setLaboratory("");
        setErrors({ laboratory: [] });
        onLaboratoryAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occurred during store laboratory: ",
          res.data,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during store laboratory: ",
          error,
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleStoreLaboratory}
        className="rounded-2xl border border-[#c9a84c]/20 bg-[#1C2B5E] p-6 shadow-xl shadow-black/30"
      >
        <div className="mb-4">
          <FloatingLabelInput
            label="Laboratory"
            type="text"
            name="laboratory"
            value={laboratory}
            onChange={(e) => setLaboratory(e.target.value)}
            required
            autoFocus
            errors={errors.laboratory}
          />
        </div>
        <div className="flex justify-end pt-3 border-t border-[#c9a84c]/20">
          <SubmitButton
            label="Add Laboratory"
            loading={loadingStore}
            loadingLabel="Adding Laboratory..."
          />
        </div>
      </form>
    </>
  );
};

export default AddLaboratoryForm;
