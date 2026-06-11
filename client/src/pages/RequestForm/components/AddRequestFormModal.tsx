// src/pages/RequestForm/components/AddRequestFormModal.tsx

import { useEffect, useRef, useState, type FC, type FormEvent } from "react";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import SubmitButton from "../../../components/Button/SubmitButton";
import CloseButton from "../../../components/Button/CloseButton";
import Spinner from "../../../components/Spinner/Spinner";
import RequestFormService from "../../../services/RequestFormService";
import LaboratoryService from "../../../services/LaboratoryService";
import AreaService from "../../../services/AreaService";
import CourseService from "../../../services/CourseService";
import PersonnelService from "../../../services/PersonnelService";
import StudentService from "../../../services/StudentService";
import EquipmentService from "../../../services/EquipmentService";
import type { LaboratoryColumns } from "../../../interfaces/LaboratoryInterface";
import type { Area } from "../../../interfaces/SharedInterfaces";
import type { Course } from "../../../interfaces/SharedInterfaces";
import type {
  Personnel,
  Student,
} from "../../../interfaces/PersonnelInterface";
import type { EquipmentColumns } from "../../../interfaces/EquipmentInterface";

interface AddRequestFormModalProps {
  onRequestFormAdded: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
  refreshKey: () => void;
}

interface RequestFormItem {
  equipment_id: number;
  quantity: number;
  unit: "pcs" | "set" | "unit";
  remarks: string;
}

interface FieldErrors {
  [key: string]: string[];
}

const AddRequestFormModal: FC<AddRequestFormModalProps> = ({
  onRequestFormAdded,
  isOpen,
  onClose,
  refreshKey,
}) => {
  const getTodayDateInput = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60_000)
      .toISOString()
      .split("T")[0];
  };

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Form data
  const [requestorType, setRequestorType] = useState<"student" | "personnel">(
    "student",
  );
  const [requestorId, setRequestorId] = useState("");
  const [laboratoryId, setLaboratoryId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [facultyInchargeId, setFacultyInchargeId] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [requestType, setRequestType] = useState<
    "borrow" | "maintenance" | "repair" | "release"
  >("borrow");
  const [requestDate, setRequestDate] = useState(getTodayDateInput());
  const [dateOfUse, setDateOfUse] = useState("");
  const [timeOfUse, setTimeOfUse] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [remarks, setRemarks] = useState("");

  // Items
  const [items, setItems] = useState<RequestFormItem[]>([]);
  const [currentEquipmentId, setCurrentEquipmentId] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [currentUnit, setCurrentUnit] = useState<"pcs" | "set" | "unit">("pcs");
  const [currentRemarks, setCurrentRemarks] = useState("");

  // Data lists
  const [laboratories, setLaboratories] = useState<LaboratoryColumns[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [facultyPersonnels, setFacultyPersonnels] = useState<Personnel[]>([]);
  const [equipments, setEquipments] = useState<EquipmentColumns[]>([]);

  // Requestor autocomplete state
  const [requestorSearch, setRequestorSearch] = useState("");
  const [requestorSuggestions, setRequestorSuggestions] = useState<
    (Student | Personnel)[]
  >([]);
  const [requestorSelectedLabel, setRequestorSelectedLabel] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const selectedEquipment = equipments.find(
    (equipment) => String(equipment.equipment_id) === currentEquipmentId,
  );

  const getAvailableEquipments = () =>
    equipments.filter(
      (equipment) =>
        equipment.status?.toLowerCase() === "available" &&
        Number(equipment.available_quantity) > 0,
    );

  const renderSelectedEquipmentDetails = (equipment: EquipmentColumns) => (
    <div className="mt-2 rounded-lg border border-[#c9a84c]/20 bg-[#0E1A3A]/70 p-3 text-xs text-slate-300">
      <div className="font-mono font-semibold text-[#c9a84c]">
        {equipment.equipment_code}
      </div>
      <div className="mt-1 font-semibold text-white">
        {equipment.equipment_name}
      </div>
      <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
        <span>
          Brand/Model: {equipment.brand || "-"} / {equipment.model || "-"}
        </span>
        <span>Category: {equipment.category?.category || "-"}</span>
        <span>Area: {equipment.area?.area || "-"}</span>
        <span>
          Qty/Avail: {equipment.quantity}/{equipment.available_quantity}{" "}
          {equipment.unit}
        </span>
        <span className="capitalize">Condition: {equipment.condition}</span>
        <span className="capitalize">
          Status: {(equipment.status || "").replace("_", " ")}
        </span>
      </div>
    </div>
  );

  const getFullName = (person: Student | Personnel): string => {
    const last = person.last_name ?? "";
    const first = person.first_name ?? "";
    const middle = (person as Student).middle_name
      ? ` ${((person as Student).middle_name as string).charAt(0)}.`
      : "";
    return `${last}, ${first}${middle}`.trim();
  };

  const getPersonId = (person: Student | Personnel): number => {
    return (
      (person as Student).student_id ?? (person as Personnel).personnel_id ?? 0
    );
  };

  const fetchRequestorSuggestions = async (searchValue: string) => {
    if (!searchValue.trim()) {
      setRequestorSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setSuggestionsLoading(true);
      setShowSuggestions(true);

      if (requestorType === "student") {
        const res = await StudentService.loadStudents(1, searchValue);
        if (res.status === 200) {
          const studentsData =
            res.data.students?.data || res.data.students || [];
          setRequestorSuggestions(studentsData);
        }
      } else {
        const res = await PersonnelService.loadPersonnels(1, searchValue);
        if (res.status === 200) {
          const personnelsData =
            res.data.personnels?.data || res.data.personnels || [];
          setRequestorSuggestions(personnelsData);
        }
      }
    } catch (error) {
      console.error("Error fetching requestor suggestions:", error);
      setRequestorSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleRequestorSearchChange = (value: string) => {
    setRequestorSearch(value);
    setRequestorId("");
    setRequestorSelectedLabel("");
    setActiveSuggestionIndex(-1);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      fetchRequestorSuggestions(value);
    }, 300);
  };

  const handleSelectSuggestion = (person: Student | Personnel) => {
    const id = getPersonId(person);
    const label = getFullName(person);
    setRequestorId(String(id));
    setRequestorSelectedLabel(label);
    setRequestorSearch(label);
    setShowSuggestions(false);
    setRequestorSuggestions([]);
    setActiveSuggestionIndex(-1);
  };

  const handleRequestorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || requestorSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < requestorSuggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIndex >= 0) {
        handleSelectSuggestion(requestorSuggestions[activeSuggestionIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoadData = async () => {
    try {
      setLoadingData(true);

      const [
        laboratoriesRes,
        areasRes,
        coursesRes,
        personnelsRes,
        equipmentsRes,
      ] = await Promise.all([
        LaboratoryService.loadLaboratories(1, ""),
        AreaService.loadAreas(1, ""),
        CourseService.loadCourses(),
        PersonnelService.loadPersonnels(1, ""),
        EquipmentService.loadEquipments(1, ""),
      ]);

      if (laboratoriesRes.status === 200) {
        setLaboratories(
          laboratoriesRes.data.laboratories?.data ||
            laboratoriesRes.data.laboratories ||
            [],
        );
      }
      if (areasRes.status === 200) {
        setAreas(areasRes.data.areas?.data || areasRes.data.areas || []);
      }
      if (coursesRes.status === 200) {
        setCourses(coursesRes.data.courses || []);
      }
      if (personnelsRes.status === 200) {
        const personnelData =
          personnelsRes.data.personnels?.data ||
          personnelsRes.data.personnels ||
          [];
        const faculty = personnelData.filter(
          (p: Personnel) => p.role?.role === "Faculty" || p.role_id === 3,
        );
        setFacultyPersonnels(faculty);
      }
      if (equipmentsRes.status === 200) {
        const firstPage = equipmentsRes.data.equipments as any;
        const firstPageData = firstPage?.data || firstPage || [];
        const lastPage = firstPage?.last_page || 1;

        if (lastPage > 1) {
          const remainingPages = await Promise.all(
            Array.from({ length: lastPage - 1 }, (_, index) =>
              EquipmentService.loadEquipments(index + 2, ""),
            ),
          );
          setEquipments([
            ...firstPageData,
            ...remainingPages.flatMap((res) => {
              const page = res.data.equipments as any;
              return page?.data || page || [];
            }),
          ]);
        } else {
          setEquipments(firstPageData);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCurrentEquipmentChange = (equipmentId: string) => {
    setCurrentEquipmentId(equipmentId);
    const equipment = equipments.find(
      (item) => String(item.equipment_id) === equipmentId,
    );

    if (equipment) {
      setCurrentUnit(equipment.unit);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.current_equipment_id;
        delete next.current_quantity;
        return next;
      });
    }
  };

  const handleAddItem = () => {
    if (!currentEquipmentId) {
      setErrors((prev) => ({
        ...prev,
        current_equipment_id: ["Please select equipment."],
      }));
      return;
    }

    if (!Number.isInteger(currentQuantity) || currentQuantity < 1) {
      setErrors((prev) => ({
        ...prev,
        current_quantity: ["Quantity must be at least 1."],
      }));
      return;
    }

    const equipment = equipments.find(
      (item) => String(item.equipment_id) === currentEquipmentId,
    );
    if (equipment && currentQuantity > equipment.available_quantity) {
      setErrors((prev) => ({
        ...prev,
        current_quantity: [
          `Only ${equipment.available_quantity} ${equipment.unit}(s) available.`,
        ],
      }));
      return;
    }

    // Check for duplicate
    const exists = items.some(
      (item) => String(item.equipment_id) === currentEquipmentId,
    );
    if (exists) {
      setErrors((prev) => ({
        ...prev,
        current_equipment_id: ["This equipment has already been added."],
      }));
      return;
    }

    setItems([
      ...items,
      {
        equipment_id: parseInt(currentEquipmentId),
        quantity: currentQuantity,
        unit: currentUnit,
        remarks: currentRemarks,
      },
    ]);

    setCurrentEquipmentId("");
    setCurrentQuantity(1);
    setCurrentUnit("pcs");
    setCurrentRemarks("");
    setErrors((prev) => {
      const next = { ...prev };
      delete next.current_equipment_id;
      delete next.current_quantity;
      delete next.items;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleStoreRequestForm = async (e: FormEvent) => {
    try {
      e.preventDefault();

      const validationErrors: FieldErrors = {};

      if (!requestorId) {
        validationErrors.requestor_id = ["Please select a requestor."];
      }
      if (!laboratoryId) {
        validationErrors.laboratory_id = ["Please select a laboratory."];
      }
      if (!purpose?.trim()) {
        validationErrors.purpose = ["Please enter a purpose."];
      }
      if (!dateOfUse) {
        validationErrors.date_of_use = ["Please select date of use."];
      }
      if (!timeOfUse) {
        validationErrors.time_of_use = ["Please enter time of use."];
      }
      if (items.length === 0) {
        validationErrors.items = ["Please add at least one equipment item."];
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);
      setErrors({});

      const payload = {
        requestor_id: parseInt(requestorId),
        requestor_type: requestorType,
        laboratory_id: parseInt(laboratoryId),
        area_id: areaId ? parseInt(areaId) : null,
        course_id: courseId ? parseInt(courseId) : null,
        faculty_incharge_id: facultyInchargeId
          ? parseInt(facultyInchargeId)
          : null,
        subject: subject || null,
        purpose: purpose.trim(),
        request_type: requestType,
        request_date: requestDate,
        date_of_use: dateOfUse,
        time_of_use: timeOfUse,
        expected_return_date: expectedReturnDate || null,
        remarks: remarks || null,
        items: items.map((item) => ({
          equipment_id: item.equipment_id,
          quantity: item.quantity,
          unit: item.unit,
          remarks: item.remarks || null,
        })),
      };

      const res = await RequestFormService.storeRequestForm(payload);

      if (res.status === 200 || res.status === 201) {
        if (res.data.success) {
          resetForm();
          onRequestFormAdded(
            res.data.message || "Request Form Successfully Saved",
          );
          refreshKey();
          onClose();
        }
      }
    } catch (error: any) {
      console.error("Error storing request form:", error);
      if (error.response?.status === 422 && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ form: [error.response.data.message] });
      } else {
        setErrors({
          form: ["An error occurred while saving the request form."],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRequestorType("student");
    setRequestorId("");
    setRequestorSearch("");
    setRequestorSelectedLabel("");
    setRequestorSuggestions([]);
    setShowSuggestions(false);
    setLaboratoryId("");
    setAreaId("");
    setCourseId("");
    setFacultyInchargeId("");
    setSubject("");
    setPurpose("");
    setRequestType("borrow");
    setRequestDate(getTodayDateInput());
    setDateOfUse("");
    setTimeOfUse("");
    setExpectedReturnDate("");
    setRemarks("");
    setItems([]);
    setErrors({});
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadData();
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    setRequestorId("");
    setRequestorSearch("");
    setRequestorSelectedLabel("");
    setRequestorSuggestions([]);
    setShowSuggestions(false);
  }, [requestorType]);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      className="sm:max-w-2xl md:max-w-4xl lg:max-w-5xl"
    >
      {loadingData && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 rounded-xl">
          <Spinner size="lg" />
        </div>
      )}
      <form onSubmit={handleStoreRequestForm} className="space-y-6">
        <div className="border-b border-[#c9a84c]/20 pb-4">
          <h1 className="text-2xl font-semibold text-white">
            New Request Form
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Fill in the details to create a new equipment request.
          </p>
          {errors.form && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {errors.form[0]}
            </p>
          )}
        </div>

        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Requestor Information Section */}
          <div className="bg-[#0E1A3A]/30 rounded-lg border border-[#c9a84c]/20 p-4">
            <h2 className="text-md font-semibold text-[#c9a84c] mb-4">
              Requestor Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelSelect
                  label="Requestor Type"
                  name="requestor_type"
                  value={requestorType}
                  onChange={(e) =>
                    setRequestorType(e.target.value as "student" | "personnel")
                  }
                  required
                  errors={errors.requestor_type}
                >
                  <option value="student">Student</option>
                  <option value="personnel">Personnel</option>
                </FloatingLabelSelect>
              </div>
              <div className="col-span-2 md:col-span-1 relative">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    id="requestor_search"
                    autoComplete="off"
                    value={requestorSearch}
                    onChange={(e) =>
                      handleRequestorSearchChange(e.target.value)
                    }
                    onKeyDown={handleRequestorKeyDown}
                    onFocus={() =>
                      requestorSuggestions.length > 0 &&
                      setShowSuggestions(true)
                    }
                    placeholder=" "
                    // required
                    className={`peer w-full rounded-lg border bg-[#0E1A3A] px-3 pt-5 pb-2 text-sm text-white placeholder-transparent outline-none transition-colors focus:ring-1 ${
                      errors.requestor_id
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                        : "border-[#c9a84c]/30 focus:border-[#c9a84c] focus:ring-[#c9a84c]/20"
                    }`}
                  />
                  <label
                    htmlFor="requestor_search"
                    className={`pointer-events-none absolute left-3 top-2 text-xs font-medium transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium ${
                      errors.requestor_id
                        ? "text-red-400"
                        : "text-[#c9a84c]/80 peer-focus:text-[#c9a84c]"
                    }`}
                  >
                    {requestorType === "student" ? "Student" : "Personnel"}{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {suggestionsLoading && (
                      <svg
                        className="h-4 w-4 animate-spin text-[#c9a84c]/60"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                {showSuggestions && (
                  <div
                    ref={suggestionsRef}
                    className="absolute left-0 right-0 z-50 mt-1 rounded-lg border border-[#c9a84c]/20 bg-[#0E1A3A] shadow-2xl overflow-hidden"
                  >
                    {suggestionsLoading ? (
                      <div className="px-4 py-3 text-sm text-slate-400">
                        Searching...
                      </div>
                    ) : requestorSuggestions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">
                        No{" "}
                        {requestorType === "student"
                          ? "students"
                          : "personnels"}{" "}
                        found
                      </div>
                    ) : (
                      <ul className="max-h-48 overflow-y-auto">
                        {requestorSuggestions.map((person, index) => {
                          const id = getPersonId(person);
                          const label = getFullName(person);
                          const isActive = index === activeSuggestionIndex;
                          return (
                            <li key={id}>
                              <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSelectSuggestion(person)}
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                                  isActive
                                    ? "bg-[#c9a84c]/20 text-white"
                                    : "text-slate-300 hover:bg-[#c9a84c]/10"
                                }`}
                              >
                                <span className="font-medium truncate">
                                  {label}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
                {requestorId && !showSuggestions && (
                  <p className="mt-1 text-xs text-[#c9a84c]/70 flex items-center gap-1">
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Selected:{" "}
                    <span className="text-[#c9a84c] font-medium">
                      {requestorSelectedLabel}
                    </span>
                  </p>
                )}
                {errors.requestor_id && (
                  <span className="text-[#c9a84c] text-xs mt-1 ml-1 block">
                    {errors.requestor_id[0]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Facility Information Section */}
          <div className="bg-[#0E1A3A]/30 rounded-lg border border-[#c9a84c]/20 p-4">
            <h2 className="text-md font-semibold text-[#c9a84c] mb-4">
              Facility Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelSelect
                  label="Laboratory"
                  name="laboratory_id"
                  value={laboratoryId}
                  onChange={(e) => setLaboratoryId(e.target.value)}
                  required
                  errors={errors.laboratory_id}
                >
                  <option value="">Select Laboratory</option>
                  {laboratories.map((lab) => (
                    <option key={lab.laboratory_id} value={lab.laboratory_id}>
                      {lab.laboratory}
                    </option>
                  ))}
                </FloatingLabelSelect>
              </div>
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelSelect
                  label="Area"
                  name="area_id"
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  errors={errors.area_id}
                >
                  <option value="">Select Area (Optional)</option>
                  {areas.map((area) => (
                    <option key={area.area_id} value={area.area_id}>
                      {area.area}
                    </option>
                  ))}
                </FloatingLabelSelect>
              </div>
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelSelect
                  label="Course"
                  name="course_id"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  errors={errors.course_id}
                >
                  <option value="">Select Course (Optional)</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course}
                    </option>
                  ))}
                </FloatingLabelSelect>
              </div>
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelSelect
                  label="Faculty In-Charge"
                  name="faculty_incharge_id"
                  value={facultyInchargeId}
                  onChange={(e) => setFacultyInchargeId(e.target.value)}
                  errors={errors.faculty_incharge_id}
                >
                  <option value="">Select Faculty (Optional)</option>
                  {facultyPersonnels.map((faculty) => (
                    <option
                      key={faculty.personnel_id}
                      value={faculty.personnel_id}
                    >
                      {faculty.last_name}, {faculty.first_name}
                    </option>
                  ))}
                </FloatingLabelSelect>
              </div>
              <div className="col-span-2">
                <FloatingLabelInput
                  label="Subject"
                  type="text"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  errors={errors.subject}
                />
              </div>
            </div>
          </div>

          {/* Request Details Section */}
          <div className="bg-[#0E1A3A]/30 rounded-lg border border-[#c9a84c]/20 p-4">
            <h2 className="text-md font-semibold text-[#c9a84c] mb-4">
              Request Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FloatingLabelInput
                  label="Purpose"
                  type="text"
                  name="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  errors={errors.purpose}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelSelect
                  label="Request Type"
                  name="request_type"
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as any)}
                  required
                  errors={errors.request_type}
                >
                  <option value="borrow">Borrow</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="release">Release</option>
                </FloatingLabelSelect>
              </div>
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelInput
                  label="Request Date"
                  type="date"
                  name="request_date"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  required
                  errors={errors.request_date}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelInput
                  label="Date of Use"
                  type="date"
                  name="date_of_use"
                  value={dateOfUse}
                  onChange={(e) => setDateOfUse(e.target.value)}
                  required
                  errors={errors.date_of_use}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelInput
                  label="Time of Use"
                  type="time"
                  name="time_of_use"
                  value={timeOfUse}
                  onChange={(e) => setTimeOfUse(e.target.value)}
                  required
                  errors={errors.time_of_use}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelInput
                  label="Expected Return Date"
                  type="date"
                  name="expected_return_date"
                  value={expectedReturnDate}
                  onChange={(e) => setExpectedReturnDate(e.target.value)}
                  errors={errors.expected_return_date}
                />
              </div>
              <div className="col-span-2">
                <FloatingLabelInput
                  label="Remarks"
                  type="text"
                  name="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  errors={errors.remarks}
                />
              </div>
            </div>
          </div>

          {/* Equipment Items Section */}
          <div className="bg-[#0E1A3A]/30 rounded-lg border border-[#c9a84c]/20 p-4">
            <h2 className="text-md font-semibold text-[#c9a84c] mb-4">
              Equipment Items
            </h2>
            {errors.items && (
              <p className="mb-3 rounded-lg border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-3 py-2 text-sm text-[#c9a84c]">
                {errors.items[0]}
              </p>
            )}

            {/* Add Item Form */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="col-span-4 md:col-span-2">
                <FloatingLabelSelect
                  label="Equipment"
                  name="equipment_id"
                  value={currentEquipmentId}
                  onChange={(e) => handleCurrentEquipmentChange(e.target.value)}
                  errors={errors.current_equipment_id}
                >
                  <option value="">Select Equipment</option>
                  {getAvailableEquipments().map((eq) => (
                      <option
                        key={eq.equipment_id}
                        value={eq.equipment_id.toString()}
                      >
                        {eq.equipment_code} - {eq.equipment_name} (
                        {eq.available_quantity} available)
                      </option>
                    ))}
                </FloatingLabelSelect>
                {selectedEquipment &&
                  renderSelectedEquipmentDetails(selectedEquipment)}
              </div>
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelInput
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={currentQuantity.toString()}
                  onChange={(e) =>
                    setCurrentQuantity(parseInt(e.target.value) || 1)
                  }
                  min={1}
                  errors={errors.current_quantity}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <FloatingLabelSelect
                  label="Unit"
                  name="unit"
                  value={currentUnit}
                  onChange={(e) => setCurrentUnit(e.target.value as any)}
                >
                  <option value="pcs">Pieces (pcs)</option>
                  <option value="set">Set</option>
                  <option value="unit">Unit</option>
                </FloatingLabelSelect>
              </div>
              <div className="col-span-4">
                <FloatingLabelInput
                  label="Item Remarks"
                  type="text"
                  name="item_remarks"
                  value={currentRemarks}
                  onChange={(e) => setCurrentRemarks(e.target.value)}
                />
              </div>
              <div className="col-span-4">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full md:w-auto px-4 py-2 bg-[#c9a84c] hover:bg-[#b8963e] text-[#1C2B5E] font-semibold rounded-lg transition-colors"
                >
                  + Add Item
                </button>
              </div>
            </div>

            {/* Items List */}
            {items.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">
                  Requested Items ({items.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0E1A3A] rounded-lg">
                      <tr>
                        <th className="px-3 py-2 text-left text-[#c9a84c]/70 text-xs">
                          Equipment
                        </th>
                        <th className="px-3 py-2 text-center text-[#c9a84c]/70 text-xs">
                          Qty
                        </th>
                        <th className="px-3 py-2 text-left text-[#c9a84c]/70 text-xs">
                          Unit
                        </th>
                        <th className="px-3 py-2 text-left text-[#c9a84c]/70 text-xs">
                          Remarks
                        </th>
                        <th className="px-3 py-2 text-center text-[#c9a84c]/70 text-xs">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c9a84c]/10">
                      {items.map((item, index) => {
                        const equipment = equipments.find(
                          (equipment) =>
                            String(equipment.equipment_id) ===
                            String(item.equipment_id),
                        );
                        return (
                          <tr key={index} className="hover:bg-[#c9a84c]/5">
                            <td className="px-3 py-2 text-white">
                              {equipment?.equipment_name ||
                                `Equipment #${item.equipment_id}`}
                            </td>
                            <td className="px-3 py-2 text-center text-white">
                              {item.quantity}
                            </td>
                            <td className="px-3 py-2 text-slate-300">
                              {item.unit}
                            </td>
                            <td className="px-3 py-2 text-slate-400">
                              {item.remarks || "-"}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Remove"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#c9a84c]/20 pt-4">
          <CloseButton label="Cancel" onClose={onClose} />
          <SubmitButton
            label="Submit Request"
            loading={loading}
            loadingLabel="Submitting..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddRequestFormModal;
