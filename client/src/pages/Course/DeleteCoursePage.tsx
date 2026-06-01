import { useEffect } from "react";
import DeleteCourseForm from "./components/DeleteCourseForm";

const DeleteCoursePage = () => {
  useEffect(() => {
    document.title = "Delete Course Page";
  }, []);

  return (
    <>
      <DeleteCourseForm />
    </>
  );
};

export default DeleteCoursePage;
