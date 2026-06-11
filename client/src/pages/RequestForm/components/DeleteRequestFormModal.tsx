// src/pages/RequestForm/components/DeleteRequestFormModal.tsx

import { useEffect, useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import RequestFormService from "../../../services/RequestFormService";
import type { RequestForm } from "../../../interfaces/RequestFormInterface";

interface DeleteRequestFormModalProps {
  requestForm: RequestForm | null;
  onRequestFormDeleted: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const DeleteRequestFormModal: FC<DeleteRequestFormModalProps> = ({
  requestForm,
  onRequestFormDeleted,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [requestNumber, setRequestNumber] = useState("");
  const [status, setStatus] = useState("");
  const [itemsCount, setItemsCount] = useState(0);
  const [dateOfUse, setDateOfUse] = useState("");
  const [requestorName, setRequestorName] = useState("");
  const [laboratoryName, setLaboratoryName] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [requestType, setRequestType] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const handleDestroyRequestForm = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!requestForm || !requestForm.request_id) {
        alert("Invalid request form data");
        return;
      }

      setLoadingDestroy(true);

      const res = await RequestFormService.destroyRequestForm(
        requestForm.request_id!,
      );

      if (res.status === 200 && res.data.success) {
        onRequestFormDeleted(
          res.data.message || "Request form deleted successfully",
        );
        refreshKey();
        onClose();
      } else {
        alert(res.data.message || "Failed to delete request form");
      }
    } catch (error: any) {
      console.error("Error deleting request form:", error);
      alert(
        error.response?.data?.message || "An error occurred while deleting",
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    if (isOpen && requestForm) {
      // Debug log to see what data is available
      console.log("DeleteModal - RequestForm:", requestForm);

      setRequestNumber(requestForm.request_number || "");
      setStatus(requestForm.status || "");
      const items = requestForm.items || requestForm.requested_equipments;
      setItemsCount(items?.length || 0);
      setDateOfUse(requestForm.date_of_use || "");
      setRequestType(requestForm.request_type || "");
      setCreatedAt(requestForm.created_at || "");

      // Get requestor name
      const requestor = requestForm.requestor as any;
      if (requestor && requestor.last_name && requestor.first_name) {
        const name = `${requestor.last_name}, ${requestor.first_name}${
          requestor.middle_name ? ` ${requestor.middle_name.charAt(0)}.` : ""
        }`;
        setRequestorName(name);
      } else {
        setRequestorName(`ID: ${requestForm.requestor_id}`);
      }

      // Get laboratory name
      const laboratory = requestForm.laboratory as any;
      if (laboratory && laboratory.laboratory) {
        setLaboratoryName(laboratory.laboratory);
      } else {
        setLaboratoryName(`Lab ID: ${requestForm.laboratory_id}`);
      }

      // Get faculty incharge name - check multiple possible locations
      let faculty = null;

      // Try different possible property names
      if (requestForm.facultyIncharge) {
        faculty = requestForm.facultyIncharge;
      } else if ((requestForm as any).faculty_incharge) {
        faculty = (requestForm as any).faculty_incharge;
      } else if ((requestForm as any).facultyInCharge) {
        faculty = (requestForm as any).facultyInCharge;
      }

      console.log("DeleteModal - Faculty data:", faculty);

      if (faculty && faculty.last_name && faculty.first_name) {
        const name = `${faculty.last_name}, ${faculty.first_name}${
          faculty.middle_name ? ` ${faculty.middle_name.charAt(0)}.` : ""
        }`;
        setFacultyName(name);
        console.log("DeleteModal - Faculty name set to:", name);
      } else if (requestForm.faculty_incharge_id) {
        setFacultyName(`Faculty ID: ${requestForm.faculty_incharge_id}`);
      } else {
        setFacultyName("—");
      }
    }
  }, [isOpen, requestForm]);

  if (!isOpen || !requestForm) return null;

  const getStatusClass = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      case "ongoing":
        return "bg-blue-500/20 text-blue-400";
      case "completed":
        return "bg-emerald-500/20 text-emerald-400";
      case "cancelled":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusWarning = () => {
    switch (status) {
      case "pending":
        return "This request form is still pending and can be deleted safely.";
      case "approved":
        return "This request form has been approved and may have related transactions.";
      case "ongoing":
        return "This request form is currently ongoing and deleting it may affect equipment tracking.";
      case "completed":
        return "This request form is completed and may have historical records.";
      case "cancelled":
        return "This request form is already cancelled.";
      default:
        return "This request form may have related records.";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleDestroyRequestForm}>
        <div className="border-b border-red-500/20 bg-red-500/5 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-400"
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
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Delete Request Form
              </h1>
              <p className="text-sm text-slate-400">
                This action is permanent and cannot be undone
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Warning Banner */}
          <div
            className={`rounded-lg p-4 ${
              status === "pending"
                ? "bg-yellow-500/10 border border-yellow-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p
                  className={`font-semibold mb-1 ${
                    status === "pending" ? "text-yellow-400" : "text-red-400"
                  }`}
                >
                  Warning!
                </p>
                <p
                  className={`text-sm ${
                    status === "pending"
                      ? "text-yellow-300/80"
                      : "text-red-300/80"
                  }`}
                >
                  {getStatusWarning()}
                </p>
                {itemsCount > 0 && (
                  <p
                    className={`text-sm mt-2 ${
                      status === "pending"
                        ? "text-yellow-300/80"
                        : "text-red-300/80"
                    }`}
                  >
                    • This request form contains {itemsCount} equipment item(s)
                    that will also be removed.
                  </p>
                )}
                {status !== "pending" && (
                  <p className="text-sm mt-2 text-red-300/80">
                    • Deleting a processed request form may cause data
                    inconsistency.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-[#0E1A3A]/50 rounded-lg border border-[#c9a84c]/20 overflow-hidden">
            <div className="p-4 border-b border-[#c9a84c]/20 bg-[#0E1A3A]/30">
              <h3 className="text-sm font-semibold text-[#c9a84c]">
                Request Details
              </h3>
            </div>
            <div className="grid grid-cols-2 divide-x divide-[#c9a84c]/20">
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-[#c9a84c]/60 text-xs uppercase tracking-wider font-semibold block mb-1">
                    Request Number
                  </label>
                  <p className="text-white font-mono font-semibold text-base">
                    {requestNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-[#c9a84c]/60 text-xs uppercase tracking-wider font-semibold block mb-1">
                    Requestor
                  </label>
                  <p className="text-white font-medium text-sm">
                    {requestorName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-[#c9a84c]/60 text-xs uppercase tracking-wider font-semibold block mb-1">
                    Laboratory
                  </label>
                  <p className="text-white font-medium text-sm">
                    {laboratoryName || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-[#c9a84c]/60 text-xs uppercase tracking-wider font-semibold block mb-1">
                    Faculty In-Charge
                  </label>
                  <p className="text-white font-medium text-sm">
                    {facultyName || "N/A"}
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-[#c9a84c]/60 text-xs uppercase tracking-wider font-semibold block mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass()}`}
                  >
                    {status || "N/A"}
                  </span>
                </div>
                <div>
                  <label className="text-[#c9a84c]/60 text-xs uppercase tracking-wider font-semibold block mb-1">
                    Request Type
                  </label>
                  <p className="text-white font-medium capitalize text-sm">
                    {requestType || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-[#c9a84c]/60 text-xs uppercase tracking-wider font-semibold block mb-1">
                    Date of Use
                  </label>
                  <p className="text-white font-medium text-sm">
                    {dateOfUse ? formatDate(dateOfUse) : "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-[#c9a84c]/60 text-xs uppercase tracking-wider font-semibold block mb-1">
                    Created
                  </label>
                  <p className="text-white font-medium text-sm">
                    {createdAt ? formatDateTime(createdAt) : "N/A"}
                  </p>
                </div>
                {itemsCount > 0 && (
                  <div>
                    <label className="text-[#c9a84c]/60 text-xs uppercase tracking-wider font-semibold block mb-1">
                      Equipment Items
                    </label>
                    <p className="text-white font-medium text-sm">
                      {itemsCount} item(s)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="bg-[#0E1A3A]/30 rounded-lg border border-[#c9a84c]/20 p-4">
            <label className="text-slate-300 text-sm block mb-2">
              Type{" "}
              <span className="font-mono text-[#c9a84c] font-semibold">
                {requestNumber}
              </span>{" "}
              to confirm deletion:
            </label>
            <input
              type="text"
              id="confirm_delete"
              name="confirm_delete"
              placeholder={`Enter "${requestNumber}" to confirm`}
              className="w-full rounded-lg border border-red-500/30 bg-[#0E1A3A] px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/30"
              onKeyUp={(e) => {
                const input = e.target as HTMLInputElement;
                const confirmButton = document.getElementById(
                  "confirmDeleteButton",
                );
                if (confirmButton) {
                  if (input.value === requestNumber) {
                    confirmButton.removeAttribute("disabled");
                  } else {
                    confirmButton.setAttribute("disabled", "disabled");
                  }
                }
              }}
            />
            <p className="mt-2 text-xs text-slate-500">
              This confirmation helps prevent accidental deletion.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#c9a84c]/20 p-5 bg-[#0E1A3A]/30">
          <CloseButton label="Cancel" onClose={onClose} />
          <button
            id="confirmDeleteButton"
            type="submit"
            disabled={true}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg shadow-red-600/30 border border-red-500/20 hover:border-red-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loadingDestroy ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              <>
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
                Delete Permanently
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DeleteRequestFormModal;
