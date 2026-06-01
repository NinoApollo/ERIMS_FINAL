import { useEffect, useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import type { LaboratoryFieldErrors } from "../../../interfaces/LaboratoryInterface";
import type { CourseColumns } from "../../../interfaces/CourseInterface";
import LaboratoryService from "../../../services/LaboratoryService";
import CourseService from "../../../services/CourseService";

interface AddLaboratoryFormProps {
  onLaboratoryAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddLaboratoryForm: FC<AddLaboratoryFormProps> = ({
  onLaboratoryAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courses, setCourses] = useState<CourseColumns[]>([]);
  const [laboratory, setLaboratory] = useState("");
  const [courseId, setCourseId] = useState("");
  const [errors, setErrors] = useState<LaboratoryFieldErrors>({
    laboratory: [],
  });

  const handleLoadCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await CourseService.loadCourses();
      if (res.status === 200) {
        setCourses(res.data.courses);
      } else {
        console.error(
          "Unexpected status error occurred during loading courses: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading courses: ",
        error,
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleStoreLaboratory = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await LaboratoryService.storeLaboratory({
        laboratory,
        course_id: courseId,
      });

      if (res.status === 200) {
        setLaboratory("");
        setCourseId("");
        setErrors({ laboratory: [] });
        onLaboratoryAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occurred during store laboratory: ",
          res.data,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during store laboratory: ",
          error,
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  useEffect(() => {
    handleLoadCourses();
  }, []);

  return (
    <>
      <form
        onSubmit={handleStoreLaboratory}
        className="rounded-2xl border border-[#c9a84c]/20 bg-[#1C2B5E] p-6 shadow-xl shadow-black/30"
      >
        <div className="mb-4">
          <FloatingLabelInput
            label="Laboratory"
            type="text"
            name="laboratory"
            value={laboratory}
            onChange={(e) => setLaboratory(e.target.value)}
            required
            autoFocus
            errors={errors.laboratory}
          />
        </div>
        <div className="mb-4">
          <FloatingLabelSelect
            label="Course"
            name="course_id"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
            errors={errors.course_id}
          >
            {loadingCourses ? (
              <option value="">Loading...</option>
            ) : (
              <>
                <option value="">Select Course</option>
                {courses.map((course, index) => (
                  <option value={course.course_id} key={index}>
                    {course.course}
                  </option>
                ))}
              </>
            )}
          </FloatingLabelSelect>
        </div>
        <div className="flex justify-end pt-3 border-t border-[#c9a84c]/20">
          <SubmitButton
            label="Add Laboratory"
            loading={loadingStore}
            loadingLabel="Adding Laboratory..."
          />
        </div>
      </form>
    </>
  );
};

export default AddLaboratoryForm;
