// src/pages/ActivityLogs/ActivityLogMainPage.tsx

import { useEffect, useState } from "react";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import ActivityLogList from "./components/ActivityLogList";
import ShowActivityLogModal from "./components/ShowActivityLogModal";
import ActivityLogService from "../../services/ActivityLogService";
import type { ActivityLogColumns } from "../../interfaces/ActivityLogInterface";

const ActivityLogMainPage = () => {
  useEffect(() => {
    document.title = "Activity Logs";
  }, []);

  const [stats, setStats] = useState({
    total_logs: 0,
    today_logs: 0,
    this_week_logs: 0,
  });

  const {
    isOpen: isShowLogModalOpen,
    selectedUser: selectedLog,
    openModal: openShowLogModal,
    closeModal: closeShowLogModal,
  } = useModal(false);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  const { refresh, handleRefresh } = useRefresh(false);

  const handleLoadStats = async () => {
    try {
      const res = await ActivityLogService.getActivityStats();
      if (res.status === 200) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleClearOldLogs = async () => {
    if (confirm("Are you sure you want to clear logs older than 30 days?")) {
      try {
        const res = await ActivityLogService.clearOldLogs(30);
        if (res.status === 200) {
          showToastMessage(res.data.message);
          handleRefresh();
          handleLoadStats();
        }
      } catch (error) {
        console.error("Error clearing logs:", error);
      }
    }
  };

  useEffect(() => {
    handleLoadStats();
  }, [refresh]);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />

      <ShowActivityLogModal
        activityLog={selectedLog as ActivityLogColumns | null}
        isOpen={isShowLogModalOpen}
        onClose={closeShowLogModal}
      />

      <div className="space-y-6">
        {/* Statistics Cards + Clear Button Row */}
        <div className="flex flex-wrap items-start gap-6">
          {/* Stats Cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Logs */}
            <div className="bg-[#1C2B5E] rounded-xl border border-[#c9a84c]/20 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#c9a84c]/70 text-xs uppercase tracking-wider font-semibold">
                    Total Logs
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats.total_logs}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#c9a84c]/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#c9a84c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Today's Logs */}
            <div className="bg-[#1C2B5E] rounded-xl border border-[#c9a84c]/20 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#c9a84c]/70 text-xs uppercase tracking-wider font-semibold">
                    Today's Logs
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats.today_logs}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#c9a84c]/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#c9a84c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* This Week's Logs */}
            <div className="bg-[#1C2B5E] rounded-xl border border-[#c9a84c]/20 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#c9a84c]/70 text-xs uppercase tracking-wider font-semibold">
                    This Week's Logs
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stats.this_week_logs}
                  </p>
                </div>
                <div className="w-12 h-12 bg-[#c9a84c]/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#c9a84c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Clear Old Logs Button — standalone, not inside a stat card */}
          <div className="flex items-start pt-1">
            <button
              onClick={handleClearOldLogs}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-500/30 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
              title="Clear logs older than 30 days"
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
              Clear Old Logs
            </button>
          </div>
        </div>

        {/* Activity Logs List */}
        <ActivityLogList
          refreshKey={refresh}
          onViewLog={(log) => openShowLogModal(log as any)}
        />
      </div>
    </>
  );
};

export default ActivityLogMainPage;
