import { useEffect, useState, type FC, type FormEvent } from "react";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import SubmitButton from "../../../components/Button/SubmitButton";
import CloseButton from "../../../components/Button/CloseButton";
import Spinner from "../../../components/Spinner/Spinner";
import RequestFormService from "../../../services/RequestFormService";
import AreaService from "../../../services/AreaService";
import CourseService from "../../../services/CourseService";
import PersonnelService from "../../../services/PersonnelService";
import EquipmentService from "../../../services/EquipmentService";
import type { RequestForm } from "../../../interfaces/RequestFormInterface";
import type { Area } from "../../../interfaces/SharedInterfaces";
import type { Course } from "../../../interfaces/SharedInterfaces";
import type { Personnel } from "../../../interfaces/PersonnelInterface";
import type { EquipmentColumns } from "../../../interfaces/EquipmentInterface";

interface EditRequestFormModalProps {
  requestForm: RequestForm | null;
  onRequestFormUpdated: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
  refreshKey: () => void;
}

interface RequestFormItem {
  equipment_id: number;
  equipment_name?: string;
  equipment_code?: string;
  quantity: number;
  unit: "pcs" | "set" | "unit";
  remarks: string;
}

interface FieldErrors {
  [key: string]: string[];
}

const EditRequestFormModal: FC<EditRequestFormModalProps> = ({
  requestForm,
  onRequestFormUpdated,
  isOpen,
  onClose,
  refreshKey,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadedRequestForm, setLoadedRequestForm] = useState<RequestForm | null>(
    null,
  );

  // Form data
  const [areaId, setAreaId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [facultyInchargeId, setFacultyInchargeId] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [requestType, setRequestType] = useState<
    "borrow" | "maintenance" | "repair" | "release"
  >("borrow");
  const [requestDate, setRequestDate] = useState("");
  const [dateOfUse, setDateOfUse] = useState("");
  const [timeOfUse, setTimeOfUse] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [actualReturnDate, setActualReturnDate] = useState("");
  const [remarks, setRemarks] = useState("");

  // Status fields
  const [status, setStatus] = useState("");
  const [releasedBy, setReleasedBy] = useState("");
  const [endorsedBy, setEndorsedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");

  // Items
  const [items, setItems] = useState<RequestFormItem[]>([]);
  const [currentEquipmentId, setCurrentEquipmentId] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [currentUnit, setCurrentUnit] = useState<"pcs" | "set" | "unit">("pcs");
  const [currentRemarks, setCurrentRemarks] = useState("");

  // Data lists
  const [areas, setAreas] = useState<Area[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [facultyPersonnels, setFacultyPersonnels] = useState<Personnel[]>([]);
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [equipments, setEquipments] = useState<EquipmentColumns[]>([]);

  // Errors
  const [errors, setErrors] = useState<FieldErrors>({});
  const [activeTab, setActiveTab] = useState<"details" | "status">("details");
  const activeRequestForm = loadedRequestForm || requestForm;
  const selectedEquipment = equipments.find(
    (equipment) => String(equipment.equipment_id) === currentEquipmentId,
  );

  const getAvailableEquipments = () =>
    equipments.filter(
      (equipment) =>
        equipment.status === "available" && equipment.available_quantity > 0,
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

  const formatDateInput = (value?: string | null) => {
    if (!value) return "";
    return value.includes("T") ? value.split("T")[0] : value.slice(0, 10);
  };

  const formatTimeInput = (value?: string | null) => {
    if (!value) return "";
    return value.slice(0, 5);
  };

  const handleLoadData = async () => {
    try {
      setLoadingData(true);

      const [areasRes, coursesRes, personnelsRes, equipmentsRes] =
        await Promise.all([
          AreaService.loadAreas(1, ""),
          CourseService.loadCourses(),
          PersonnelService.loadPersonnels(1, ""),
          EquipmentService.loadEquipments(1, ""),
        ]);

      if (areasRes.status === 200) {
        const areasData =
          areasRes.data.areas?.data || areasRes.data.areas || [];
        setAreas(areasData);
      }
      if (coursesRes.status === 200) {
        const coursesData =
          coursesRes.data.courses?.data || coursesRes.data.courses || [];
        setCourses(coursesData);
      }
      if (personnelsRes.status === 200) {
        const personnelData =
          personnelsRes.data.personnels?.data ||
          personnelsRes.data.personnels ||
          [];
        setPersonnels(personnelData);
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

    // Check if item already exists
    const existingItem = items.find(
      (item) => String(item.equipment_id) === currentEquipmentId,
    );
    if (existingItem) {
      setErrors((prev) => ({
        ...prev,
        current_equipment_id: [
          "This equipment is already added. Remove the existing item first if you want to change it.",
        ],
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

  const handleUpdateRequestForm = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      setErrors({});

      if (!activeRequestForm) {
        setErrors({ form: ["Request form data is still loading. Please try again."] });
        setLoading(false);
        return;
      }

      // If updating status, use the status update endpoint
      if (activeTab === "status") {
        if (!status) {
          setErrors({ status: ["Please select a status."] });
          setLoading(false);
          return;
        }

        const statusPayload: any = {
          status: status,
        };

        if (endorsedBy && endorsedBy !== "")
          statusPayload.endorsed_by = parseInt(endorsedBy);
        if (approvedBy && approvedBy !== "")
          statusPayload.approved_by = parseInt(approvedBy);
        if (releasedBy && releasedBy !== "")
          statusPayload.released_by = parseInt(releasedBy);
        if (remarks && remarks !== "") statusPayload.remarks = remarks;

        const res = await RequestFormService.updateRequestFormStatus(
          activeRequestForm?.request_id!,
          statusPayload,
        );

        if (res.status === 200 && res.data.success) {
          onRequestFormUpdated(
            res.data.message || "Status updated successfully",
          );
          refreshKey();
          onClose();
        }
      } else if (activeTab === "details") {
        const validationErrors: FieldErrors = {};

        if (!purpose || purpose.trim() === "") {
          validationErrors.purpose = ["Purpose is required."];
        }
        if (!requestDate) {
          validationErrors.request_date = ["Request date is required."];
        }
        if (!dateOfUse) {
          validationErrors.date_of_use = ["Date of use is required."];
        }
        if (!timeOfUse) {
          validationErrors.time_of_use = ["Time of use is required."];
        }
        if (activeRequestForm.status === "pending" && items.length === 0) {
          validationErrors.items = ["Please add at least one equipment item."];
        }

        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          setLoading(false);
          return;
        }

        // Build payload - only include fields that are allowed to be updated
        const payload: any = {};

        // Only include fields that have values (or null for optional fields)
        payload.area_id = areaId && areaId !== "" ? parseInt(areaId) : null;
        payload.course_id =
          courseId && courseId !== "" ? parseInt(courseId) : null;
        payload.faculty_incharge_id =
          facultyInchargeId && facultyInchargeId !== ""
            ? parseInt(facultyInchargeId)
            : null;
        payload.subject = subject && subject !== "" ? subject : null;
        payload.purpose = purpose.trim();
        payload.request_type = requestType;
        payload.request_date = requestDate;
        payload.date_of_use = dateOfUse;
        payload.time_of_use = timeOfUse;
        payload.expected_return_date =
          expectedReturnDate && expectedReturnDate !== ""
            ? expectedReturnDate
            : null;
        payload.remarks = remarks && remarks !== "" ? remarks : null;

        // Only include actual_return_date if status is completed
        if (
          activeRequestForm?.status === "completed" &&
          actualReturnDate &&
          actualReturnDate !== ""
        ) {
          payload.actual_return_date = actualReturnDate;
        }

        // Only include items if status is pending
        if (activeRequestForm?.status === "pending" && items.length > 0) {
          payload.items = items;
        }

        const res = await RequestFormService.updateRequestForm(
          activeRequestForm?.request_id!,
          payload,
        );

        if (res.status === 200 && res.data.success) {
          onRequestFormUpdated(
            res.data.message || "Request form updated successfully",
          );
          refreshKey();
          onClose();
        }
      }
    } catch (error: any) {
      console.error("Error updating request form:", error);
      if (error.response && error.response.status === 422) {
        console.error("Validation errors:", error.response.data.errors);
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          form: [
            error.response?.data?.message || "An error occurred while updating.",
          ],
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data when modal opens
  useEffect(() => {
    if (isOpen && requestForm) {
      let isActive = true;
      const loadInitialData = async () => {
        setLoadingData(true);
        try {
          await handleLoadData();

          const res = await RequestFormService.getRequestForm(
            requestForm.request_id,
          );
          const fullRequestForm =
            res.status === 200 && res.data.success && res.data.request_form
              ? res.data.request_form
              : requestForm;

          if (!isActive) return;

          setLoadedRequestForm(fullRequestForm);

          // Set form values from the latest full request form data
          setAreaId(fullRequestForm.area_id?.toString() || "");
          setCourseId(fullRequestForm.course_id?.toString() || "");

          // Set faculty incharge
          let facultyId = "";
          if (fullRequestForm.faculty_incharge_id) {
            facultyId = fullRequestForm.faculty_incharge_id.toString();
          } else if (fullRequestForm.facultyIncharge?.personnel_id) {
            facultyId = fullRequestForm.facultyIncharge.personnel_id.toString();
          }
          setFacultyInchargeId(facultyId);

          setSubject(fullRequestForm.subject || "");
          setPurpose(fullRequestForm.purpose || "");
          setRequestType(fullRequestForm.request_type || "borrow");
          setRequestDate(formatDateInput(fullRequestForm.request_date));
          setDateOfUse(formatDateInput(fullRequestForm.date_of_use));
          setTimeOfUse(formatTimeInput(fullRequestForm.time_of_use));
          setExpectedReturnDate(
            formatDateInput(fullRequestForm.expected_return_date),
          );
          setActualReturnDate(
            formatDateInput(fullRequestForm.actual_return_date),
          );
          setRemarks(fullRequestForm.remarks || "");
          setStatus(fullRequestForm.status || "pending");

          // Set personnel fields
          setReleasedBy(fullRequestForm.released_by?.toString() || "");
          setEndorsedBy(fullRequestForm.endorsed_by?.toString() || "");
          setApprovedBy(fullRequestForm.approved_by?.toString() || "");

          // Load existing items
          const existingItems =
            fullRequestForm.items || fullRequestForm.requested_equipments;

          if (existingItems && existingItems.length > 0) {
            setItems(
              existingItems.map((item: any) => ({
                equipment_id: item.equipment_id,
                equipment_name: item.equipment_name,
                equipment_code: item.equipment_code,
                quantity: item.quantity,
                unit: item.unit || "pcs",
                remarks: item.remarks || "",
              })),
            );
          } else {
            setItems([]);
          }

          setErrors({});
          setActiveTab("details");
        } catch (error) {
          console.error("Error loading request form details:", error);
        } finally {
          if (isActive) setLoadingData(false);
        }
      };

      loadInitialData();

      return () => {
        isActive = false;
      };
    }
  }, [isOpen, requestForm?.request_id]);

  // Reset data loaded flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLoadedRequestForm(null);
      setLoadingData(false);
      setErrors({});
      setActiveTab("details");
    }
  }, [isOpen]);

  const showStatusTab = activeRequestForm?.status !== "pending";

  // Get faculty display name
  const getFacultyDisplayName = () => {
    if (facultyInchargeId && facultyPersonnels.length > 0) {
      const faculty = facultyPersonnels.find(
        (f) => f.personnel_id === parseInt(facultyInchargeId),
      );
      if (faculty) {
        return `${faculty.last_name}, ${faculty.first_name}${faculty.middle_name ? ` ${faculty.middle_name.charAt(0)}.` : ""}`;
      }
    }
    if (activeRequestForm?.facultyIncharge) {
      return `${activeRequestForm.facultyIncharge.last_name}, ${activeRequestForm.facultyIncharge.first_name}`;
    }
    return "";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      className="sm:max-w-2xl md:max-w-4xl lg:max-w-5xl"
    >
      {loadingData && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-xl">
          <Spinner size="lg" />
        </div>
      )}
      <form onSubmit={handleUpdateRequestForm} className="space-y-6">
        <div className="border-b border-[#c9a84c]/20 pb-4">
          <h1 className="text-2xl font-semibold text-white">
            Edit Request Form
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Request Number:{" "}
            <span className="font-mono text-[#c9a84c]">
              {activeRequestForm?.request_number}
            </span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Status:{" "}
            <span
              className={`capitalize ${
                activeRequestForm?.status === "pending"
                  ? "text-yellow-400"
                  : activeRequestForm?.status === "approved"
                    ? "text-green-400"
                    : activeRequestForm?.status === "rejected"
                      ? "text-red-400"
                      : activeRequestForm?.status === "ongoing"
                        ? "text-blue-400"
                        : activeRequestForm?.status === "completed"
                          ? "text-emerald-400"
                          : "text-gray-400"
              }`}
            >
              {activeRequestForm?.status}
            </span>
          </p>
          {errors.form && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {errors.form[0]}
            </p>
          )}

          {/* Tab Buttons */}
          <div className="flex gap-4 mt-4 border-b border-[#c9a84c]/20">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "details"
                  ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              Request Details
            </button>
            {showStatusTab && (
              <button
                type="button"
                onClick={() => setActiveTab("status")}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === "status"
                    ? "text-[#c9a84c] border-b-2 border-[#c9a84c]"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                Update Status
              </button>
            )}
          </div>
        </div>

        {activeTab === "details" && (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
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
                    <option key={area.area_id} value={area.area_id.toString()}>
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
                    <option
                      key={course.course_id}
                      value={course.course_id.toString()}
                    >
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
                      value={faculty.personnel_id?.toString() || ""}
                    >
                      {`${faculty.last_name}, ${faculty.first_name}${faculty.middle_name ? ` ${faculty.middle_name.charAt(0)}.` : ""}`}
                    </option>
                  ))}
                </FloatingLabelSelect>
                {getFacultyDisplayName() && (
                  <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Current: {getFacultyDisplayName()}
                  </p>
                )}
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

              {activeRequestForm?.status === "completed" && (
                <div className="col-span-2 md:col-span-1">
                  <FloatingLabelInput
                    label="Actual Return Date"
                    type="date"
                    name="actual_return_date"
                    value={actualReturnDate}
                    onChange={(e) => setActualReturnDate(e.target.value)}
                    errors={errors.actual_return_date}
                  />
                </div>
              )}

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

              {/* Items Section - Only show if status is pending */}
              {activeRequestForm?.status === "pending" && (
                <>
                  <div className="col-span-2 mt-4 border-t border-[#c9a84c]/20 pt-4">
                    <h2 className="text-lg font-semibold text-[#c9a84c] mb-3">
                      Equipment Items ({items.length})
                    </h2>
                    {errors.items && (
                      <p className="mb-3 rounded-lg border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-3 py-2 text-sm text-[#c9a84c]">
                        {errors.items[0]}
                      </p>
                    )}
                    {items.length === 0 && (
                      <p className="text-sm text-yellow-400/70 mb-2">
                        No items added yet. Use the form below to add equipment
                        items.
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 grid grid-cols-4 gap-2">
                    <div className="col-span-4 md:col-span-2">
                      <FloatingLabelSelect
                        label="Add Equipment"
                        name="equipment_id"
                        value={currentEquipmentId}
                        onChange={(e) =>
                          handleCurrentEquipmentChange(e.target.value)
                        }
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
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setCurrentQuantity(isNaN(value) ? 1 : value);
                        }}
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
                        className="px-4 py-2 bg-[#c9a84c] hover:bg-[#b8963e] text-[#1C2B5E] font-semibold rounded-lg transition-colors"
                      >
                        + Add Item
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Items List */}
              {items.length > 0 && (
                <div className="col-span-2 mt-2">
                  <h3 className="text-md font-semibold text-slate-300 mb-2">
                    Current Items ({items.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                      <thead className="text-xs uppercase bg-[#0E1A3A]">
                        <tr>
                          <th className="px-3 py-2">Equipment</th>
                          <th className="px-3 py-2">Qty</th>
                          <th className="px-3 py-2">Unit</th>
                          <th className="px-3 py-2">Remarks</th>
                          {activeRequestForm?.status === "pending" && (
                            <th className="px-3 py-2">Action</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => {
                          const equipment = equipments.find(
                            (equipment) =>
                              String(equipment.equipment_id) ===
                              String(item.equipment_id),
                          );
                          return (
                            <tr
                              key={index}
                              className="border-b border-[#c9a84c]/10"
                            >
                              <td className="px-3 py-2">
                                {equipment?.equipment_name ||
                                  item.equipment_name ||
                                  `Equipment #${item.equipment_id}`}
                                {(equipment?.equipment_code ||
                                  item.equipment_code) && (
                                  <span className="ml-2 text-xs text-slate-500">
                                    (
                                    {equipment?.equipment_code ||
                                      item.equipment_code}
                                    )
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2">{item.quantity}</td>
                              <td className="px-3 py-2">{item.unit}</td>
                              <td className="px-3 py-2">
                                {item.remarks || "-"}
                              </td>
                              {activeRequestForm?.status === "pending" && (
                                <td className="px-3 py-2">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    Remove
                                  </button>
                                </td>
                              )}
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
        )}

        {activeTab === "status" && showStatusTab && (
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-[#0E1A3A]/30 rounded-lg border border-[#c9a84c]/20 p-4">
              <h3 className="text-sm font-semibold text-[#c9a84c] mb-3">
                Current Status:
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : status === "ongoing"
                            ? "bg-blue-500/20 text-blue-400"
                            : status === "completed"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {status}
                </span>
              </h3>
            </div>

            <FloatingLabelSelect
              label="New Status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              errors={errors.status}
            >
              <option value="">Select Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </FloatingLabelSelect>

            {(status === "approved" || status === "ongoing") && (
              <>
                <FloatingLabelSelect
                  label="Endorsed By"
                  name="endorsed_by"
                  value={endorsedBy}
                  onChange={(e) => setEndorsedBy(e.target.value)}
                  errors={errors.endorsed_by}
                >
                  <option value="">Select Personnel</option>
                  {personnels.map((personnel) => (
                    <option
                      key={personnel.personnel_id}
                      value={personnel.personnel_id?.toString() || ""}
                    >
                      {`${personnel.last_name}, ${personnel.first_name} (${personnel.role?.role || "Staff"})`}
                    </option>
                  ))}
                </FloatingLabelSelect>

                <FloatingLabelSelect
                  label="Approved By"
                  name="approved_by"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  errors={errors.approved_by}
                >
                  <option value="">Select Personnel</option>
                  {personnels.map((personnel) => (
                    <option
                      key={personnel.personnel_id}
                      value={personnel.personnel_id?.toString() || ""}
                    >
                      {`${personnel.last_name}, ${personnel.first_name} (${personnel.role?.role || "Staff"})`}
                    </option>
                  ))}
                </FloatingLabelSelect>
              </>
            )}

            {(status === "ongoing" || status === "completed") && (
              <FloatingLabelSelect
                label="Released By"
                name="released_by"
                value={releasedBy}
                onChange={(e) => setReleasedBy(e.target.value)}
                errors={errors.released_by}
              >
                <option value="">Select Personnel</option>
                {personnels.map((personnel) => (
                  <option
                    key={personnel.personnel_id}
                    value={personnel.personnel_id?.toString() || ""}
                  >
                    {`${personnel.last_name}, ${personnel.first_name} (${personnel.role?.role || "Staff"})`}
                  </option>
                ))}
              </FloatingLabelSelect>
            )}

            <FloatingLabelInput
              label="Status Remarks"
              type="text"
              name="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              errors={errors.remarks}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-[#c9a84c]/20 pt-4">
          {!loading && <CloseButton label="Cancel" onClose={onClose} />}
          <SubmitButton
            label={activeTab === "status" ? "Update Status" : "Save Changes"}
            loading={loading}
            loadingLabel={
              activeTab === "status"
                ? "Updating Status..."
                : "Saving Changes..."
            }
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditRequestFormModal;
