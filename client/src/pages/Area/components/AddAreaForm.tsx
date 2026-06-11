import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { AreaFieldErrors } from "../../../interfaces/AreaInterface";
import AreaService from "../../../services/AreaService";

interface AddAreaFormProps {
  onAreaAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddAreaForm: FC<AddAreaFormProps> = ({ onAreaAdded, refreshKey }) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [area, setArea] = useState("");
  const [errors, setErrors] = useState<AreaFieldErrors>({
    area: [],
  });

  const handleStoreArea = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await AreaService.storeArea({
        area,
      });

      if (res.status === 200) {
        setArea("");
        setErrors({ area: [] });
        onAreaAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occurred during store area: ",
          res.data,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during store area: ",
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
        onSubmit={handleStoreArea}
        className="rounded-2xl border border-[#c9a84c]/20 bg-[#1C2B5E] p-6 shadow-xl shadow-black/30"
      >
        <div className="mb-4">
          <FloatingLabelInput
            label="Area"
            type="text"
            name="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
            autoFocus
            errors={errors.area}
          />
        </div>
        <div className="flex justify-end pt-3 border-t border-[#c9a84c]/20">
          <SubmitButton
            label="Add Area"
            loading={loadingStore}
            loadingLabel="Adding Area..."
          />
        </div>
      </form>
    </>
  );
};

export default AddAreaForm;
