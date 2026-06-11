import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import UploadInput from "../../../components/Input/UploadInput";
import StudentService from "../../../services/StudentService";
import GenderService from "../../../services/GenderService";
import CourseService from "../../../services/CourseService";
import YearLevelService from "../../../services/YearLevelService";
import DepartmentService from "../../../services/DepartmentService";
import type { GenderColumns } from "../../../interfaces/GenderInterface";
import type { CourseColumns } from "../../../interfaces/CourseInterface";
import type { YearLevelColumns } from "../../../interfaces/YearLevelInterface";
import type { DepartmentColumns } from "../../../interfaces/DepartmentInterface";
import type {
  StudentColumns,
  StudentFieldErrors,
} from "../../../interfaces/StudentInterface";

interface EditStudentFormModalProps {
  student: StudentColumns | null;
  onStudentUpdated: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditStudentFormModal: FC<EditStudentFormModalProps> = ({
  student,
  onStudentUpdated,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColumns[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courses, setCourses] = useState<CourseColumns[]>([]);
  const [loadingYearLevels, setLoadingYearLevels] = useState(false);
  const [yearLevels, setYearLevels] = useState<YearLevelColumns[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [departments, setDepartments] = useState<DepartmentColumns[]>([]);

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [existingProfilePicture, setExistingProfilePicture] = useState<
    string | null
  >(null);
  const [editProfilePicture, setEditProfilePicture] = useState<File | null>(
    null,
  );
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<StudentFieldErrors>({});

  const handleUpdateStudent = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const formData = new FormData();
      formData.append("_method", "PUT");

      if (editProfilePicture) {
        formData.append("edit_profile_picture", editProfilePicture);
      } else if (!existingProfilePicture) {
        formData.append("remove_profile_picture", "1");
      }

      formData.append("first_name", firstName);
      formData.append("middle_name", middleName || "");
      formData.append("last_name", lastName);
      formData.append("suffix_name", suffixName || "");
      formData.append("gender", gender);
      formData.append("course", course);
      formData.append("year_level", yearLevel);
      formData.append("department", department);
      formData.append("birth_date", birthDate);
      formData.append("username", username);

      const res = await StudentService.updateStudent(
        student?.student_id!,
        formData,
      );

      if (res.status === 200 && res.data.student) {
        setExistingProfilePicture(
          res.data.student.profile_picture
            ? res.data.student.profile_picture
            : null,
        );
        setEditProfilePicture(null);
        setFirstName(res.data.student.first_name);
        setMiddleName(res.data.student.middle_name ?? "");
        setLastName(res.data.student.last_name);
        setSuffixName(res.data.student.suffix_name ?? "");
        setGender(res.data.student.gender_id.toString());
        setCourse(res.data.student.course_id.toString());
        setYearLevel(res.data.student.year_level_id.toString());
        setDepartment(res.data.student.department_id.toString());
        setBirthDate(res.data.student.birth_date);
        setUsername(res.data.student.username);
        setErrors({});

        onStudentUpdated(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected status error occurred during updating student: ",
          res.status,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating student: ",
          error,
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleLoadGenders = async () => {
    try {
      setLoadingGenders(true);
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders);
      }
    } catch (error) {
      console.error("Error loading genders:", error);
    } finally {
      setLoadingGenders(false);
    }
  };

  const handleLoadCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await CourseService.loadCourses();
      if (res.status === 200) {
        setCourses(res.data.courses);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleLoadYearLevels = async () => {
    try {
      setLoadingYearLevels(true);
      const res = await YearLevelService.loadYearLevels();
      if (res.status === 200) {
        setYearLevels(res.data.yearLevels);
      }
    } catch (error) {
      console.error("Error loading year levels:", error);
    } finally {
      setLoadingYearLevels(false);
    }
  };

  const handleLoadDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const res = await DepartmentService.loadDepartments();
      if (res.status === 200) {
        setDepartments(res.data.departments);
      }
    } catch (error) {
      console.error("Error loading departments:", error);
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
      handleLoadCourses();
      handleLoadYearLevels();
      handleLoadDepartments();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && student) {
      setEditProfilePicture(null);
      setExistingProfilePicture(
        student.profile_picture ? student.profile_picture : null,
      );
      setFirstName(student.first_name);
      setMiddleName(student.middle_name ?? "");
      setLastName(student.last_name);
      setSuffixName(student.suffix_name ?? "");
      setGender(student.gender_id.toString());
      setCourse(student.course_id.toString());
      setYearLevel(student.year_level_id.toString());
      setDepartment(student.department_id.toString());
      setBirthDate(student.birth_date);
      setUsername(student.username);
      setErrors({});
    }
  }, [isOpen, student]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      className="sm:max-w-2xl md:max-w-4xl"
    >
      <form onSubmit={handleUpdateStudent} className="space-y-6">
        <div className="border-b border-[#c9a84c]/20 pb-4">
          <h1 className="text-2xl font-semibold text-white">
            Edit Student Form
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Update the student information below.
          </p>
          <div className="mt-4">
            <UploadInput
              label="Profile Picture"
              name="edit_profile_picture"
              value={editProfilePicture}
              onChange={setEditProfilePicture}
              onRemoveExistingImageUrl={() => setExistingProfilePicture(null)}
              existingImageUrl={existingProfilePicture}
              errors={errors.edit_profile_picture}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-[#c9a84c]/20 pb-4 max-h-[64vh] overflow-y-auto pr-2">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <FloatingLabelInput
                label="First Name"
                type="text"
                name="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoFocus
                errors={errors.first_name}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Middle Name"
                type="text"
                name="middle_name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                errors={errors.middle_name}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Last Name"
                type="text"
                name="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                errors={errors.last_name}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Suffix Name"
                type="text"
                name="suffix_name"
                value={suffixName}
                onChange={(e) => setSuffixName(e.target.value)}
                errors={errors.suffix_name}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelSelect
                label={loadingGenders ? "Loading Genders..." : "Gender"}
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                disabled={loadingGenders}
                errors={errors.gender}
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g.gender_id} value={g.gender_id.toString()}>
                    {g.gender}
                  </option>
                ))}
              </FloatingLabelSelect>
            </div>
            <div className="mb-4">
              <FloatingLabelSelect
                label={loadingCourses ? "Loading Courses..." : "Course"}
                name="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                disabled={loadingCourses}
                errors={errors.course}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.course_id} value={c.course_id.toString()}>
                    {c.course}
                  </option>
                ))}
              </FloatingLabelSelect>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <FloatingLabelSelect
                label={
                  loadingYearLevels ? "Loading Year Levels..." : "Year Level"
                }
                name="year_level"
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
                required
                disabled={loadingYearLevels}
                errors={errors.year_level}
              >
                <option value="">Select Year Level</option>
                {yearLevels.map((yl) => (
                  <option
                    key={yl.year_level_id}
                    value={yl.year_level_id.toString()}
                  >
                    {yl.year_level}
                  </option>
                ))}
              </FloatingLabelSelect>
            </div>
            <div className="mb-4">
              <FloatingLabelSelect
                label={
                  loadingDepartments ? "Loading Departments..." : "Department"
                }
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                disabled={loadingDepartments}
                errors={errors.department}
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option
                    key={d.department_id}
                    value={d.department_id.toString()}
                  >
                    {d.department}
                  </option>
                ))}
              </FloatingLabelSelect>
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Birth Date"
                type="date"
                name="birth_date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                errors={errors.birth_date}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                errors={errors.username}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#c9a84c]/20 pt-4">
          {!loadingUpdate && <CloseButton label="Close" onClose={onClose} />}
          <SubmitButton
            label="Update Student"
            loading={loadingUpdate}
            loadingLabel="Updating Student..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditStudentFormModal;
