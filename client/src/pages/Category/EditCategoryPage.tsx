import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";
import EditCategoryForm from "./components/EditCategoryForm";

const EditCategoryPage = () => {
  useEffect(() => {
    document.title = "Edit Category Page";
  }, []);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <EditCategoryForm onCategoryUpdated={showToastMessage} />
    </>
  );
};

export default EditCategoryPage;
