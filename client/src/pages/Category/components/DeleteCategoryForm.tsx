import { useEffect, useState, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import CategoryService from "../../../services/CategoryService";

const DeleteCategoryForm = () => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [category, setCategory] = useState("");

  const { category_id } = useParams();
  const navigate = useNavigate();

  const handleGetCategory = async (category_id: string | number) => {
    try {
      setLoadingGet(true);

      const res = await CategoryService.getCategory(category_id);

      if (res.status === 200) {
        setCategory(res.data.category.category);
      } else {
        console.error(
          "Unexpected status error occured during deleting category: ",
          res.status,
        );
      }
    } catch (error) {
      {
        console.error(
          "Unexpected server error occured during deleting category: ",
          error,
        );
      }
    } finally {
      setLoadingGet(false);
    }
  };

  const handleDestroyCategory = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingDestroy(true);

      const res = await CategoryService.destroyCategory(category_id!);

      if (res.status === 200) {
        navigate("/categories", { state: { message: res.data.message } });
      } else {
        console.error(
          "Unexpected status error occured during deleting category: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occured during deleting category : ",
        error,
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    if (category_id) {
      const parsedCategoryId = parseInt(category_id);
      handleGetCategory(parsedCategoryId);
    } else {
      console.error(
        "Unexpected parameter error occured during getting: ",
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
          onSubmit={handleDestroyCategory}
          className="rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] p-6 shadow-xl shadow-black/30"
        >
          <div className="mb-4">
            <FloatingLabelInput
              label="Category"
              type="text"
              name="category"
              value={category}
              readonly
            />
          </div>
          <div className="flex justify-end gap-4 pt-3 border-t border-[#c9a84c]/20">
            {!loadingDestroy && <BackButton label="Back" path="/categories" />}
            <SubmitButton
              label="Delete Category"
              className="bg-red-600 hover:bg-red-700"
              loading={loadingDestroy}
              loadingLabel="Deleting Category..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteCategoryForm;
