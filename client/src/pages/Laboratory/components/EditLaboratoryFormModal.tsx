import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import Modal from "../../../components/Modal";
import LaboratoryService from "../../../services/LaboratoryService";
import CourseService from "../../../services/CourseService";
import type {
  LaboratoryColumns,
  LaboratoryFieldErrors,
} from "../../../interfaces/LaboratoryInterface";
import type { CourseColumns } from "../../../interfaces/CourseInterface";

interface EditLaboratoryFormModalProps {
  laboratory: LaboratoryColumns | null;
  onLaboratoryUpdated: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditLaboratoryFormModal: FC<EditLaboratoryFormModalProps> = ({
  laboratory,
  onLaboratoryUpdated,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courses, setCourses] = useState<CourseColumns[]>([]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [laboratoryName, setLaboratoryName] = useState("");
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

  const handleUpdateLaboratory = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await LaboratoryService.updateLaboratory(
        laboratory?.laboratory_id!,
        { laboratory: laboratoryName, course_id: courseId },
      );

      if (res.status === 200) {
        setLaboratoryName(res.data.laboratory.laboratory);
        setCourseId(res.data.laboratory.course_id.toString());
        setErrors({ laboratory: [] });
        onLaboratoryUpdated(res.data.message);
        handleLoadCourses();
        refreshKey();
      } else {
        console.error(
          "Unexpected status error occurred during updating laboratory: ",
          res.status,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating laboratory: ",
          error,
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadCourses();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (laboratory) {
        setLaboratoryName(laboratory.laboratory);
        setCourseId(laboratory.course.course_id.toString());
        setErrors({ laboratory: [] });
      } else {
        console.error(
          "Unexpected laboratory error occurred during getting laboratory details: ",
          laboratory,
        );
      }
    }
  }, [isOpen, laboratory]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleUpdateLaboratory} className="space-y-6">
          <div className="border-b border-[#c9a84c]/20 pb-4">
            <h1 className="text-2xl font-semibold text-white">
              Edit Laboratory
            </h1>
            <p className="mt-2 text-sm text-[#c9a84c]/60">
              Update the laboratory information below.
            </p>
          </div>
          <div className="space-y-4">
            <FloatingLabelInput
              label="Laboratory"
              type="text"
              name="laboratory"
              value={laboratoryName}
              onChange={(e) => setLaboratoryName(e.target.value)}
              required
              autoFocus
              errors={errors.laboratory}
            />
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
          <div className="flex justify-end gap-2 border-t border-[#c9a84c]/20 pt-4">
            {!loadingUpdate && <CloseButton label="Close" onClose={onClose} />}
            <SubmitButton
              label="Update Laboratory"
              loading={loadingUpdate}
              loadingLabel="Updating Laboratory..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditLaboratoryFormModal;
