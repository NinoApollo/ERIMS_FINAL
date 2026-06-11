// src/pages/Students/components/AddStudentFormModal.tsx

import { useEffect, useState, type FC, type FormEvent } from "react";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import SubmitButton from "../../../components/Button/SubmitButton";
import CloseButton from "../../../components/Button/CloseButton";
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
import type { StudentFieldErrors } from "../../../interfaces/StudentInterface";

interface AddStudentFormModalProps {
  onStudentAdded: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
  refreshKey: () => void;
}

const AddStudentFormModal: FC<AddStudentFormModalProps> = ({
  onStudentAdded,
  isOpen,
  onClose,
  refreshKey,
}) => {
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColumns[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courses, setCourses] = useState<CourseColumns[]>([]);
  const [loadingYearLevels, setLoadingYearLevels] = useState(false);
  const [yearLevels, setYearLevels] = useState<YearLevelColumns[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [departments, setDepartments] = useState<DepartmentColumns[]>([]);

  const [loadingStore, setLoadingStore] = useState(false);
  const [addProfilePicture, setAddProfilePicture] = useState<File | null>(null);
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
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<StudentFieldErrors>({});

  const handleStoreStudent = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const formData = new FormData();

      if (addProfilePicture) {
        formData.append("add_profile_picture", addProfilePicture);
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
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);

      const res = await StudentService.storeStudent(formData);

      if (res.status === 200) {
        setAddProfilePicture(null);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setSuffixName("");
        setGender("");
        setCourse("");
        setYearLevel("");
        setDepartment("");
        setBirthDate("");
        setUsername("");
        setPassword("");
        setPasswordConfirmation("");
        setErrors({});

        onStudentAdded(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected status error occurred during adding student: ",
          res.status,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during adding student: ",
          error,
        );
      }
    } finally {
      setLoadingStore(false);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      className="sm:max-w-2xl md:max-w-4xl"
    >
      <form onSubmit={handleStoreStudent} className="space-y-6">
        <div className="border-b border-[#c9a84c]/20 pb-4">
          <h1 className="text-2xl font-semibold text-white">
            Add Student Form
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter the new student information to add a student account.
          </p>
          <div className="mt-4">
            <UploadInput
              label="Profile Picture"
              name="add_profile_picture"
              value={addProfilePicture}
              onChange={setAddProfilePicture}
              errors={errors.add_profile_picture}
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
                label="Gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                errors={errors.gender}
              >
                <option value="">Select Gender</option>
                {loadingGenders ? (
                  <option value="">Loading...</option>
                ) : (
                  genders.map((g) => (
                    <option key={g.gender_id} value={g.gender_id}>
                      {g.gender}
                    </option>
                  ))
                )}
              </FloatingLabelSelect>
            </div>
            <div className="mb-4">
              <FloatingLabelSelect
                label="Course"
                name="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                errors={errors.course}
              >
                <option value="">Select Course</option>
                {loadingCourses ? (
                  <option value="">Loading...</option>
                ) : (
                  courses.map((c) => (
                    <option key={c.course_id} value={c.course_id}>
                      {c.course}
                    </option>
                  ))
                )}
              </FloatingLabelSelect>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <FloatingLabelSelect
                label="Year Level"
                name="year_level"
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
                required
                errors={errors.year_level}
              >
                <option value="">Select Year Level</option>
                {loadingYearLevels ? (
                  <option value="">Loading...</option>
                ) : (
                  yearLevels.map((yl) => (
                    <option key={yl.year_level_id} value={yl.year_level_id}>
                      {yl.year_level}
                    </option>
                  ))
                )}
              </FloatingLabelSelect>
            </div>
            <div className="mb-4">
              <FloatingLabelSelect
                label="Department"
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                errors={errors.department}
              >
                <option value="">Select Department</option>
                {loadingDepartments ? (
                  <option value="">Loading...</option>
                ) : (
                  departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                      {d.department}
                    </option>
                  ))
                )}
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
            <div className="mb-4">
              <FloatingLabelInput
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                errors={errors.password}
              />
            </div>
            <div className="mb-4">
              <FloatingLabelInput
                label="Password Confirmation"
                type="password"
                name="password_confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                errors={errors.password_confirmation}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#c9a84c]/20 pt-4">
          {!loadingStore && <CloseButton label="Close" onClose={onClose} />}
          <SubmitButton
            label="Save Student"
            loading={loadingStore}
            loadingLabel="Saving Student..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddStudentFormModal;
