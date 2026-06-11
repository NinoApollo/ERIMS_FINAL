// src/pages/ActivityLogs/components/ActivityLogList.tsx

import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import ActivityLogService from "../../../services/ActivityLogService";
import Spinner from "../../../components/Spinner/Spinner";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { ActivityLogColumns } from "../../../interfaces/ActivityLogInterface";

interface ActivityLogListProps {
  refreshKey: boolean;
  onViewLog: (log: ActivityLogColumns | null) => void;
}

const getActionColor = (action: string) => {
  if (action.includes("login")) return "bg-blue-500/20 text-blue-400";
  if (action.includes("create") || action.includes("store"))
    return "bg-green-500/20 text-green-400";
  if (action.includes("update") || action.includes("edit"))
    return "bg-yellow-500/20 text-yellow-400";
  if (action.includes("delete") || action.includes("destroy"))
    return "bg-red-500/20 text-red-400";
  if (action.includes("approve")) return "bg-emerald-500/20 text-emerald-400";
  if (action.includes("reject")) return "bg-orange-500/20 text-orange-400";
  return "bg-gray-500/20 text-gray-400";
};

const ActivityLogList: FC<ActivityLogListProps> = ({
  refreshKey,
  onViewLog,
}) => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<ActivityLogColumns[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // scrollable tbody container ref
  const tableBodyRef = useRef<HTMLDivElement>(null);

  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);
  const currentPageRef = useRef(currentPage);

  hasMoreRef.current = hasMore;
  loadingRef.current = loading;
  currentPageRef.current = currentPage;

  const handleLoadLogs = async (page: number, append = false) => {
    try {
      setLoading(true);

      const res = await ActivityLogService.loadActivityLogs(page, {
        search: debouncedSearch,
        action: actionFilter,
        date_from: dateFrom,
        date_to: dateTo,
      });

      if (res.status === 200) {
        const data =
          res.data.activity_logs.data || res.data.activity_logs || [];
        const totalPages = res.data.activity_logs.last_page || 1;

        setLogs((prev) => (append ? [...prev, ...data] : data));
        setCurrentPage(page);
        setHasMore(page < totalPages);
      } else {
        setLogs(append ? logs : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableBodyRef.current;
    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
      hasMoreRef.current &&
      !loadingRef.current
    ) {
      handleLoadLogs(currentPageRef.current + 1, true);
    }
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 800);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLogs([]);
    setCurrentPage(1);
    setHasMore(true);
    handleLoadLogs(1, false);
  }, [refreshKey, debouncedSearch, actionFilter, dateFrom, dateTo]);

  useEffect(() => {
    const ref = tableBodyRef.current;
    if (ref) ref.addEventListener("scroll", handleScroll);
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] shadow-2xl">
      {/* Filters toolbar — outside the scroll container so it stays visible */}
      <div className="p-4 flex flex-wrap gap-4 justify-between border-b border-[#c9a84c]/20 bg-[#1C2B5E]">
        <div className="flex gap-4 flex-wrap">
          <div className="w-64">
            <FloatingLabelInput
              label="Search"
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="w-48">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-3 py-2 bg-[#0E1A3A] border border-[#c9a84c]/30 rounded-lg text-slate-300 focus:outline-none focus:border-[#c9a84c]"
            >
              <option value="">All Actions</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
            </select>
          </div>
          <div className="w-48">
            <FloatingLabelInput
              label="Date From"
              type="date"
              name="date_from"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="w-48">
            <FloatingLabelInput
              label="Date To"
              type="date"
              name="date_to"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sticky header — outside scroll so it never scrolls away */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-[#c9a84c]/30 bg-[#6B1E3C] text-[#c9a84c] text-xs uppercase tracking-widest">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-center">
                No.
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                User
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Action
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Description
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                IP Address
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Timestamp
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-center">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* Scrollable body — height accounts for: top nav (5rem) + stats row (~10rem) + filter bar (~4.5rem) + table header (~3rem) */}
      <div
        ref={tableBodyRef}
        className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-25rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <Table>
          <TableBody className="divide-y divide-white/6 text-slate-300 text-sm bg-[#1C2B5E]">
            {loading && logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-6 text-center">
                  <Spinner size="md" />
                </TableCell>
              </TableRow>
            ) : logs.length > 0 ? (
              <>
                {logs.map((log, index) => (
                  <TableRow
                    key={log.log_id}
                    className="hover:bg-[#6B1E3C]/20 transition-colors duration-150"
                  >
                    <TableCell className="px-4 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">
                          {log.student || log.personnel ? (
                            <>
                              {log.student?.last_name ||
                                log.personnel?.last_name}
                              ,{" "}
                              {log.student?.first_name ||
                                log.personnel?.first_name}
                            </>
                          ) : (
                            "System"
                          )}
                        </p>
                        {log.personnel?.role && (
                          <p className="text-xs text-[#c9a84c]/70">
                            {log.personnel.role.role}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 max-w-md truncate">
                      {log.description || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-mono text-xs">
                      {log.ip_address || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs">
                      {formatDate(log.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onViewLog(log)}
                        className="text-[#c9a84c] font-medium cursor-pointer hover:text-[#e8c96a] hover:underline transition-colors"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="px-4 py-3 text-center">
                      <Spinner size="md" />
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-4 py-8 text-center font-medium text-slate-500"
                >
                  No Records Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ActivityLogList;
