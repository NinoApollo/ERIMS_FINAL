// src/pages/RequestForm/components/ShowRequestFormModal.tsx

import { useEffect, useState, type FC } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import type {
  RequestForm,
  RequestFormItem,
} from "../../../interfaces/RequestFormInterface";

interface ShowRequestFormModalProps {
  requestForm: RequestForm | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    dot: "bg-yellow-400",
  },
  approved: {
    label: "Approved",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    dot: "bg-green-400",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    dot: "bg-red-400",
  },
  ongoing: {
    label: "Ongoing",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    dot: "bg-blue-400",
  },
  completed: {
    label: "Completed",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    dot: "bg-gray-400",
  },
};

const TYPE_COLOR: Record<string, string> = {
  borrow: "text-purple-400",
  maintenance: "text-orange-400",
  repair: "text-red-400",
  release: "text-cyan-400",
};

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  try {
    const date = new Date(
      dateString.includes("T") ? dateString : dateString + "T00:00:00",
    );
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return "—";
  try {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes ?? "00"} ${ampm}`;
  } catch {
    return timeString;
  }
};

/**
 * Resolves the equipment items from whichever field the API returned them in.
 * The backend may return `items` (via Eloquent accessor) or `requested_equipments` (the raw JSON column).
 */
const resolveItems = (rf: RequestForm): RequestFormItem[] => {
  if (rf.items && rf.items.length > 0) return rf.items;
  if (rf.requested_equipments && rf.requested_equipments.length > 0)
    return rf.requested_equipments;
  return [];
};

// ─── Label + value pair ────────────────────────────────────────────────────────

const InfoField: FC<{
  label: string;
  value: React.ReactNode;
  className?: string;
}> = ({ label, value, className = "" }) => (
  <div className={className}>
    <span className="block text-[10px] uppercase tracking-widest font-semibold text-[#c9a84c]/50 mb-1">
      {label}
    </span>
    <span className="block text-white font-medium leading-snug">
      {value || "—"}
    </span>
  </div>
);

// ─── Section wrapper ───────────────────────────────────────────────────────────

const Section: FC<{
  icon: string;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="bg-[#0E1A3A]/60 rounded-xl border border-[#c9a84c]/15 overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-[#c9a84c]/10 bg-[#0E1A3A]/40">
      <span className="text-base">{icon}</span>
      <h3 className="text-sm font-semibold text-[#c9a84c]">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const ShowRequestFormModal: FC<ShowRequestFormModalProps> = ({
  requestForm,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [requestorName, setRequestorName] = useState("—");
  const [requestorIdLabel, setRequestorIdLabel] = useState("—");
  const [facultyName, setFacultyName] = useState("—");

  useEffect(() => {
    if (isOpen && requestForm) {
      console.log("RequestForm data:", requestForm); // Debug log

      // Handle requestor info
      const r = requestForm.requestor as any;
      if (r) {
        const name = [r.last_name, r.first_name]
          .filter(Boolean)
          .join(", ")
          .concat(r.middle_name ? ` ${String(r.middle_name).charAt(0)}.` : "");
        setRequestorName(name || `ID: ${requestForm.requestor_id}`);
        setRequestorIdLabel(
          String(r.student_id ?? r.personnel_id ?? requestForm.requestor_id),
        );
      } else {
        setRequestorName(`ID: ${requestForm.requestor_id}`);
        setRequestorIdLabel(String(requestForm.requestor_id));
      }

      // Handle faculty incharge info - check multiple possible locations
      let faculty = null;

      // Try to get faculty from different possible locations in the response
      if (requestForm.facultyIncharge) {
        faculty = requestForm.facultyIncharge;
      } else if ((requestForm as any).faculty_incharge) {
        faculty = (requestForm as any).faculty_incharge;
      } else if ((requestForm as any).facultyInCharge) {
        faculty = (requestForm as any).facultyInCharge;
      }

      console.log("Faculty data:", faculty); // Debug log

      if (faculty && faculty.last_name && faculty.first_name) {
        const name = `${faculty.last_name}, ${faculty.first_name}${
          faculty.middle_name ? ` ${faculty.middle_name.charAt(0)}.` : ""
        }`;
        setFacultyName(name);
        console.log("Faculty name set to:", name); // Debug log
      } else if (requestForm.faculty_incharge_id) {
        setFacultyName(`Loading... (ID: ${requestForm.faculty_incharge_id})`);
        // Fetch faculty data if only ID is available
        // This would require an API call to get faculty by ID
      } else {
        setFacultyName("—");
      }
    }
  }, [isOpen, requestForm]);

  if (!requestForm || !isOpen) return null;

  const statusCfg = STATUS_CONFIG[requestForm.status] ?? STATUS_CONFIG.pending;
  const items = resolveItems(requestForm);
  const canEdit = !["completed", "cancelled"].includes(requestForm.status);

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      {/* ── Scrollable content ── */}
      <div className="flex flex-col" style={{ maxHeight: "88vh" }}>
        {/* Sticky header */}
        <div className="shrink-0 px-6 pt-5 pb-4 border-b border-[#c9a84c]/20 bg-[#1C2B5E] sticky top-0 z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-white">Request Form</h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${statusCfg.color}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                  />
                  {statusCfg.label}
                </span>
              </div>
              <p className="font-mono text-[#c9a84c] text-sm font-semibold">
                {requestForm.request_number}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Created{" "}
                {new Date(requestForm.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Request type badge */}
            <span
              className={`text-sm font-semibold capitalize px-3 py-1 rounded-lg bg-[#0E1A3A]/60 border border-[#c9a84c]/15 ${
                TYPE_COLOR[requestForm.request_type] ?? "text-slate-300"
              }`}
            >
              {requestForm.request_type}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
          {/* ── Requestor ── */}
          <Section icon="👤" title="Requestor">
            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="Type"
                value={
                  <span className="capitalize">
                    {requestForm.requestor_type}
                  </span>
                }
              />
              <InfoField
                label={
                  requestForm.requestor_type === "student"
                    ? "Student ID"
                    : "Personnel ID"
                }
                value={
                  <span className="font-mono text-sm">{requestorIdLabel}</span>
                }
              />
              <InfoField
                label="Full Name"
                value={
                  <span className="text-white font-medium">
                    {requestorName}
                  </span>
                }
                className="col-span-2"
              />
            </div>
          </Section>

          {/* ── Facility ── */}
          <Section icon="🏢" title="Facility & Course">
            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="Laboratory"
                value={requestForm.laboratory?.laboratory || "—"}
              />
              <InfoField label="Area" value={requestForm.area?.area || "—"} />
              <InfoField
                label="Course"
                value={requestForm.course?.course || "—"}
              />
              <InfoField
                label="Faculty In-Charge"
                value={
                  <span className="text-[#c9a84c] font-medium">
                    {facultyName}
                  </span>
                }
              />
              {requestForm.subject && (
                <InfoField
                  label="Subject"
                  value={requestForm.subject}
                  className="col-span-2"
                />
              )}
              <InfoField
                label="Purpose"
                value={requestForm.purpose}
                className="col-span-2"
              />
            </div>
          </Section>

          {/* ── Schedule ── */}
          <Section icon="📅" title="Schedule">
            <div className="grid grid-cols-2 gap-4">
              <InfoField
                label="Request Date"
                value={formatDate(requestForm.request_date)}
              />
              <InfoField
                label="Date of Use"
                value={formatDate(requestForm.date_of_use)}
              />
              <InfoField
                label="Time of Use"
                value={formatTime(requestForm.time_of_use)}
              />
              <InfoField
                label="Expected Return"
                value={formatDate(requestForm.expected_return_date)}
              />
              {requestForm.actual_return_date && (
                <InfoField
                  label="Actual Return"
                  value={formatDate(requestForm.actual_return_date)}
                />
              )}
              {requestForm.remarks && (
                <InfoField
                  label="Remarks"
                  value={
                    <span className="italic text-slate-300">
                      {requestForm.remarks}
                    </span>
                  }
                  className="col-span-2"
                />
              )}
            </div>
          </Section>

          {/* ── Approval chain (show if not pending) ── */}
          {requestForm.status !== "pending" &&
            (requestForm.endorsedBy ||
              requestForm.approvedBy ||
              requestForm.releasedBy) && (
              <Section icon="✅" title="Approval Chain">
                <div className="grid grid-cols-3 gap-4">
                  {requestForm.endorsedBy && (
                    <div className="text-center">
                      <span className="block text-[10px] uppercase tracking-widest font-semibold text-[#c9a84c]/50 mb-1">
                        Endorsed By
                      </span>
                      <p className="text-white text-sm font-medium">
                        {requestForm.endorsedBy.last_name},{" "}
                        {requestForm.endorsedBy.first_name}
                        {requestForm.endorsedBy.middle_name &&
                          ` ${requestForm.endorsedBy.middle_name.charAt(0)}.`}
                      </p>
                      {requestForm.endorsed_at && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatDate(requestForm.endorsed_at)}
                        </p>
                      )}
                    </div>
                  )}
                  {requestForm.approvedBy && (
                    <div className="text-center">
                      <span className="block text-[10px] uppercase tracking-widest font-semibold text-[#c9a84c]/50 mb-1">
                        Approved By
                      </span>
                      <p className="text-white text-sm font-medium">
                        {requestForm.approvedBy.last_name},{" "}
                        {requestForm.approvedBy.first_name}
                        {requestForm.approvedBy.middle_name &&
                          ` ${requestForm.approvedBy.middle_name.charAt(0)}.`}
                      </p>
                      {requestForm.approved_at && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatDate(requestForm.approved_at)}
                        </p>
                      )}
                    </div>
                  )}
                  {requestForm.releasedBy && (
                    <div className="text-center">
                      <span className="block text-[10px] uppercase tracking-widest font-semibold text-[#c9a84c]/50 mb-1">
                        Released By
                      </span>
                      <p className="text-white text-sm font-medium">
                        {requestForm.releasedBy.last_name},{" "}
                        {requestForm.releasedBy.first_name}
                        {requestForm.releasedBy.middle_name &&
                          ` ${requestForm.releasedBy.middle_name.charAt(0)}.`}
                      </p>
                      {requestForm.released_at && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatDate(requestForm.released_at)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Section>
            )}

          {/* ── Equipment Items ── */}
          <Section
            icon="🔧"
            title={`Equipment Items${items.length > 0 ? ` (${items.length})` : ""}`}
          >
            {items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#c9a84c]/15">
                      <th className="pb-2 text-left text-[10px] uppercase tracking-widest text-[#c9a84c]/50 font-semibold w-8">
                        #
                      </th>
                      <th className="pb-2 text-left text-[10px] uppercase tracking-widest text-[#c9a84c]/50 font-semibold">
                        Equipment
                      </th>
                      <th className="pb-2 text-center text-[10px] uppercase tracking-widest text-[#c9a84c]/50 font-semibold w-16">
                        Qty
                      </th>
                      <th className="pb-2 text-left text-[10px] uppercase tracking-widest text-[#c9a84c]/50 font-semibold w-16">
                        Unit
                      </th>
                      <th className="pb-2 text-left text-[10px] uppercase tracking-widest text-[#c9a84c]/50 font-semibold">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c9a84c]/8">
                    {items.map((item, i) => (
                      <tr
                        key={i}
                        className="hover:bg-[#c9a84c]/5 transition-colors"
                      >
                        <td className="py-2.5 text-slate-500 text-xs">
                          {i + 1}
                        </td>
                        <td className="py-2.5 text-white font-medium">
                          {item.equipment_name
                            ? item.equipment_name
                            : `Equipment #${item.equipment_id}`}
                          {item.equipment_code && (
                            <span className="ml-1.5 text-xs text-slate-500 font-mono">
                              ({item.equipment_code})
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-center font-semibold text-white">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 text-slate-400 capitalize">
                          {item.unit}
                        </td>
                        <td className="py-2.5 text-slate-500 italic">
                          {item.remarks || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic">
                No equipment items recorded.
              </p>
            )}
          </Section>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 flex justify-end gap-3 border-t border-[#c9a84c]/20 px-6 py-4 bg-[#1C2B5E]">
          <CloseButton label="Close" onClose={onClose} />
          {canEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-2 px-5 py-2 bg-[#c9a84c] hover:bg-[#b8963e] text-[#1C2B5E] font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Request
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ShowRequestFormModal;
