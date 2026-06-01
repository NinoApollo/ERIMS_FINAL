import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import type { CategoryFieldErrors } from "../../../interfaces/CategoryInterface";
import CategoryService from "../../../services/CategoryService";

interface EditCategoryFormProps {
  onCategoryUpdated: (message: string) => void;
}

const EditCategoryForm: FC<EditCategoryFormProps> = ({ onCategoryUpdated }) => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<CategoryFieldErrors>({});

  const { category_id } = useParams();

  const handleGetCategory = async (category_id: string | number) => {
    try {
      setLoadingGet(true);

      const res = await CategoryService.getCategory(category_id);

      if (res.status === 200) {
        setCategory(res.data.category.category);
      } else {
        console.error(
          "Unexpected status error occured during getting category: ",
          res.status,
        );
      }
    } catch (error) {
      console.log(
        "Unexpected server error occured during getting category ",
        error,
      );
    } finally {
      setLoadingGet(false);
    }
  };

  const handleUpdateCategory = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await CategoryService.updateCategory(category_id!, {
        category: category,
      });

      if (res.status === 200) {
        setErrors({});
        setCategory(res.data.category.category);
        onCategoryUpdated(res.data.message);
      } else {
        console.error(
          "Unexpected status error occured during updating category: ",
          res.status,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occured during updating category: ",
          error,
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (category_id) {
      const parsedCategoryId = parseInt(category_id);
      handleGetCategory(parsedCategoryId);
    } else {
      console.error(
        "Unexpected parameter error occured during getting category: ",
        category_id,
      );
    }
  }, [category_id]);

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form
          onSubmit={handleUpdateCategory}
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
          <div className="flex justify-end gap-4 pt-3 border-t border-[#c9a84c]/20">
            {!loadingUpdate && <BackButton label="Back" path="/categories" />}
            <SubmitButton
              label="Update Category"
              loading={loadingUpdate}
              loadingLabel="Updating Category..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditCategoryForm;
