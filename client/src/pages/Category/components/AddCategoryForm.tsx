import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { CategoryFieldErrors } from "../../../interfaces/CategoryInterface";
import CategoryService from "../../../services/CategoryService";

interface AddCategoryFormProps {
  onCategoryAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddCategoryForm: FC<AddCategoryFormProps> = ({
  onCategoryAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<CategoryFieldErrors>({});

  const handleStoreCategory = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await CategoryService.storeCategory({ category });

      if (res.status === 200) {
        setCategory("");
        setErrors({});
        onCategoryAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occured during store category: ",
          res.data,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occured during store category: ",
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
        onSubmit={handleStoreCategory}
        className="rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] p-6 shadow-xl shadow-black/30"
      >
        <div className="mb-4">
          <FloatingLabelInput
            label="Category"
            type="text"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            autoFocus
            errors={errors.category}
          />
        </div>
        <div className="flex justify-end pt-3 border-t border-[#c9a84c]/20">
          <SubmitButton
            label="Add Category"
            loading={loadingStore}
            loadingLabel="Adding Category..."
          />
        </div>
      </form>
    </>
  );
};

export default AddCategoryForm;
