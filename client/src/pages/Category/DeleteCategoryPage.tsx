import { useEffect } from "react";
import DeleteCategoryForm from "./components/DeleteCategoryForm";

const DeleteCategoryPage = () => {
  useEffect(() => {
    document.title = "Delete Category Page";
  }, []);

  return (
    <>
      <DeleteCategoryForm />
    </>
  );
};

export default DeleteCategoryPage;
