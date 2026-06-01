import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";
import EditCourseForm from "./components/EditCourseForm";

const EditCoursePage = () => {
  useEffect(() => {
    document.title = "Edit Course Page";
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
      <EditCourseForm onCourseUpdated={showToastMessage} />
    </>
  );
};

export default EditCoursePage;
