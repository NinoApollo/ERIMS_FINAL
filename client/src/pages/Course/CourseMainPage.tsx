import { useEffect } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useRefresh } from "../../hooks/useRefresh";
import { useLocation } from "react-router-dom";
import AddCourseForm from "./components/AddCourseForm";
import CourseList from "./components/CourseList";

const CourseMainPage = () => {
  const location = useLocation();

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  const { refresh, handleRefresh } = useRefresh(false);

  useEffect(() => {
    document.title = "Course Main Page";
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      showToastMessage(location.state.message);
      handleRefresh();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showToastMessage]);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="col-span-2 md:col-span-1">
          <AddCourseForm
            onCourseAdded={showToastMessage}
            refreshKey={handleRefresh}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <CourseList refreshKey={refresh} />
        </div>
      </div>
    </>
  );
};

export default CourseMainPage;
