// src/pages/ActivityLogs/components/ShowActivityLogModal.tsx

import { useEffect, useState, type FC } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import type { ActivityLogColumns } from "../../../interfaces/ActivityLogInterface";

interface ShowActivityLogModalProps {
  activityLog: ActivityLogColumns | null;
  isOpen: boolean;
  onClose: () => void;
}

const ShowActivityLogModal: FC<ShowActivityLogModalProps> = ({
  activityLog,
  isOpen,
  onClose,
}) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (isOpen && activityLog) {
      if (activityLog.student) {
        setUserName(
          `${activityLog.student.last_name}, ${activityLog.student.first_name}`,
        );
      } else if (activityLog.personnel) {
        setUserName(
          `${activityLog.personnel.last_name}, ${activityLog.personnel.first_name}`,
        );
      } else {
        setUserName("System");
      }
    }
  }, [isOpen, activityLog]);

  if (!activityLog) return null;

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <div className="space-y-6">
          <div className="border-b border-[#c9a84c]/20 pb-4">
            <h1 className="text-2xl font-semibold text-white">
              Activity Log Details
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Log ID:{" "}
              <span className="font-mono text-[#c9a84c]">
                {activityLog.log_id}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            <div className="col-span-2 md:col-span-1">
              <label className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold block mb-1">
                User
              </label>
              <p className="text-white font-medium">{userName}</p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold block mb-1">
                Action
              </label>
              <p className="text-white font-medium capitalize">
                {activityLog.action}
              </p>
            </div>

            <div className="col-span-2">
              <label className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold block mb-1">
                Description
              </label>
              <p className="text-white">{activityLog.description || "-"}</p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold block mb-1">
                IP Address
              </label>
              <p className="text-white font-mono text-sm">
                {activityLog.ip_address || "-"}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold block mb-1">
                User Agent
              </label>
              <p className="text-white text-sm break-words">
                {activityLog.user_agent || "-"}
              </p>
            </div>

            {activityLog.request_form && (
              <div className="col-span-2">
                <label className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold block mb-1">
                  Related Request Form
                </label>
                <p className="text-white font-mono">
                  {activityLog.request_form.request_number}
                </p>
              </div>
            )}

            <div className="col-span-2 md:col-span-1">
              <label className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold block mb-1">
                Created At
              </label>
              <p className="text-white">
                {formatDateTime(activityLog.created_at)}
              </p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold block mb-1">
                Last Updated
              </label>
              <p className="text-white">
                {formatDateTime(activityLog.updated_at)}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#c9a84c]/20 pt-4">
            <CloseButton label="Close" onClose={onClose} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ShowActivityLogModal;
