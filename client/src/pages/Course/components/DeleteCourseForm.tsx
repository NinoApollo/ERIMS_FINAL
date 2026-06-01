import { useEffect, useState, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import CourseService from "../../../services/CourseService";

const DeleteCourseForm = () => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [course, setCourse] = useState("");

  const { course_id } = useParams();
  const navigate = useNavigate();

  const handleGetCourse = async (course_id: string | number) => {
    try {
      setLoadingGet(true);

      const res = await CourseService.getCourse(course_id);

      if (res.status === 200) {
        setCourse(res.data.course.course);
      } else {
        console.error(
          "Unexpected status error occured during deleting course: ",
          res.status,
        );
      }
    } catch (error) {
      {
        console.error(
          "Unexpected server error occured during deleting course: ",
          error,
        );
      }
    } finally {
      setLoadingGet(false);
    }
  };

  const handleDestroyCourse = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingDestroy(true);

      const res = await CourseService.destroyCourse(course_id!);

      if (res.status === 200) {
        navigate("/courses", { state: { message: res.data.message } });
      } else {
        console.error(
          "Unexpected status error occured during deleting course: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occured during deleting course : ",
        error,
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    if (course_id) {
      const parsedCourseId = parseInt(course_id);
      handleGetCourse(parsedCourseId);
    } else {
      console.error(
        "Unexpected parameter error occured during getting: ",
        course_id,
      );
    }
  }, [course_id]);

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form
          onSubmit={handleDestroyCourse}
          className="rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] p-6 shadow-xl shadow-black/30"
        >
          <div className="mb-4">
            <FloatingLabelInput
              label="Course"
              type="text"
              name="course"
              value={course}
              readonly
            />
          </div>
          <div className="flex justify-end gap-4 pt-3 border-t border-[#c9a84c]/20">
            {!loadingDestroy && <BackButton label="Back" path="/courses" />}
            <SubmitButton
              label="Delete Course"
              className="bg-red-600 hover:bg-red-700"
              loading={loadingDestroy}
              loadingLabel="Deleting Course..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteCourseForm;
