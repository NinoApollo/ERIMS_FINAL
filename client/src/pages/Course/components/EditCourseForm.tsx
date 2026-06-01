import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import type { CourseFieldErrors } from "../../../interfaces/CourseInterface";
import CourseService from "../../../services/CourseService";

interface EditCourseFormProps {
  onCourseUpdated: (message: string) => void;
}

const EditCourseForm: FC<EditCourseFormProps> = ({ onCourseUpdated }) => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [course, setCourse] = useState("");
  const [errors, setErrors] = useState<CourseFieldErrors>({});

  const { course_id } = useParams();

  const handleGetCourse = async (course_id: string | number) => {
    try {
      setLoadingGet(true);

      const res = await CourseService.getCourse(course_id);

      if (res.status === 200) {
        setCourse(res.data.course.course);
      } else {
        console.error(
          "Unexpected status error occured during getting course: ",
          res.status,
        );
      }
    } catch (error) {
      console.log(
        "Unexpected server error occured during getting course ",
        error,
      );
    } finally {
      setLoadingGet(false);
    }
  };

  const handleUpdateCourse = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await CourseService.updateCourse(course_id!, {
        course: course,
      });

      if (res.status === 200) {
        setErrors({});
        setCourse(res.data.course.course);
        onCourseUpdated(res.data.message);
      } else {
        console.error(
          "Unexpected status error occured during updating course: ",
          res.status,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occured during updating course: ",
          error,
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (course_id) {
      const parsedCourseId = parseInt(course_id);
      handleGetCourse(parsedCourseId);
    } else {
      console.error(
        "Unexpected parameter error occured during getting course: ",
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
          onSubmit={handleUpdateCourse}
          className="rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] p-6 shadow-xl shadow-black/30"
        >
          <div className="mb-4">
            <FloatingLabelInput
              label="Course"
              type="text"
              name="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              autoFocus
              errors={errors.course}
            />
          </div>
          <div className="flex justify-end gap-4 pt-3 border-t border-[#c9a84c]/20">
            {!loadingUpdate && <BackButton label="Back" path="/courses" />}
            <SubmitButton
              label="Update Course"
              loading={loadingUpdate}
              loadingLabel="Updating Course..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditCourseForm;
