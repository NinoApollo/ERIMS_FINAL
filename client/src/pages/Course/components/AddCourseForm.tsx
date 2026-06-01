import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { CourseFieldErrors } from "../../../interfaces/CourseInterface";
import CourseService from "../../../services/CourseService";

interface AddCourseFormProps {
  onCourseAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddCourseForm: FC<AddCourseFormProps> = ({
  onCourseAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [course, setCourse] = useState("");
  const [errors, setErrors] = useState<CourseFieldErrors>({});

  const handleStoreCourse = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await CourseService.storeCourse({ course });

      if (res.status === 200) {
        setCourse("");
        setErrors({});
        onCourseAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occured during store course: ",
          res.data,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occured during store course: ",
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
        onSubmit={handleStoreCourse}
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
        <div className="flex justify-end pt-3 border-t border-[#c9a84c]/20">
          <SubmitButton
            label="Add Course"
            loading={loadingStore}
            loadingLabel="Adding Course..."
          />
        </div>
      </form>
    </>
  );
};

export default AddCourseForm;
