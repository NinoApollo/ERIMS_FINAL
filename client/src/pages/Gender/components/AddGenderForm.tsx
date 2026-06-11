import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { GenderFieldErrors } from "../../../interfaces/GenderInterface";
import GenderService from "../../../services/GenderService";

interface AddGenderFormProps {
  onGenderAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddGenderForm: FC<AddGenderFormProps> = ({
  onGenderAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<GenderFieldErrors>({});

  const handleStoreGender = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await GenderService.storeGender({ gender });

      if (res.status === 200) {
        setGender("");
        setErrors({});
        onGenderAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occured during store gender: ",
          res.data,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occured during store gender: ",
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
        onSubmit={handleStoreGender}
        className="rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] p-6 shadow-xl shadow-black/30"
      >
        <div className="mb-4">
          <FloatingLabelInput
            label="Gender"
            type="text"
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            autoFocus
            errors={errors.gender}
          />
        </div>
        <div className="flex justify-end pt-3 border-t border-[#c9a84c]/20">
          <SubmitButton
            label="Add Gender"
            loading={loadingStore}
            loadingLabel="Adding Gender..."
          />
        </div>
      </form>
    </>
  );
};

export default AddGenderForm;
