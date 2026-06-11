// src/pages/RequestForm/components/RequestFormList.tsx

import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import RequestFormService from "../../../services/RequestFormService";
import Spinner from "../../../components/Spinner/Spinner";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type {
  RequestForm,
  RequestStatus,
} from "../../../interfaces/RequestFormInterface";

interface RequestFormListProps {
  onAddRequestForm: () => void;
  onShowRequestForm: (requestForm: RequestForm | null) => void;
  onEditRequestForm: (requestForm: RequestForm | null) => void;
  onDeleteRequestForm: (requestForm: RequestForm | null) => void;
  refreshKey: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    case "approved":
      return "bg-green-500/20 text-green-400 border border-green-500/30";
    case "rejected":
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    case "ongoing":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    case "completed":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "cancelled":
      return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  }
};

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

const RequestFormList: FC<RequestFormListProps> = ({
  onShowRequestForm,
  onEditRequestForm,
  onDeleteRequestForm,
  onAddRequestForm,
  refreshKey,
}) => {
  useEffect(() => {
    document.title = "Request Form List";
  }, []);

  const [loadingRequestForms, setLoadingRequestForms] = useState(false);
  const [requestForms, setRequestForms] = useState<RequestForm[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const tableRef = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loadingRequestForms);
  const currentPageRef = useRef(currentPage);
  const debouncedSearchRef = useRef(debouncedSearch);
  const statusFilterRef = useRef(statusFilter);
  const typeFilterRef = useRef(typeFilter);

  hasMoreRef.current = hasMore;
  loadingRef.current = loadingRequestForms;
  currentPageRef.current = currentPage;
  debouncedSearchRef.current = debouncedSearch;
  statusFilterRef.current = statusFilter;
  typeFilterRef.current = typeFilter;

  const handleLoadRequestForms = async (
    page: number,
    append = false,
    searchValue: string = debouncedSearchRef.current,
    statusValue: string = statusFilterRef.current,
    typeValue: string = typeFilterRef.current,
  ) => {
    try {
      setLoadingRequestForms(true);

      const res = await RequestFormService.loadRequestForms(
        page,
        searchValue,
        statusValue,
        typeValue,
      );

      if (res.status === 200 && res.data.success) {
        const requestFormsData = res.data.request_forms?.data || [];
        const totalPages = res.data.request_forms?.last_page || 1;

        setRequestForms((prev) =>
          append ? [...prev, ...requestFormsData] : requestFormsData,
        );
        setCurrentPage(page);
        setHasMore(page < totalPages);
      } else {
        setRequestForms(append ? requestForms : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading request forms:", error);
      setRequestForms([]);
      setHasMore(false);
    } finally {
      setLoadingRequestForms(false);
      setInitialLoad(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;
    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 50 &&
      hasMoreRef.current &&
      !loadingRef.current &&
      !initialLoad
    ) {
      handleLoadRequestForms(
        currentPageRef.current + 1,
        true,
        debouncedSearchRef.current,
        statusFilterRef.current,
        typeFilterRef.current,
      );
    }
  }, [initialLoad]);

  const handleStatusChange = async (
    requestForm: RequestForm,
    newStatus: string,
  ) => {
    try {
      setUpdatingStatusId(requestForm.request_id);

      const payload: any = {
        status: newStatus,
      };

      const res = await RequestFormService.updateRequestFormStatus(
        requestForm.request_id,
        payload,
      );

      if (res.status === 200 && res.data.success) {
        setRequestForms((prev) =>
          prev.map((rf) =>
            rf.request_id === requestForm.request_id
              ? { ...rf, status: newStatus as RequestStatus }
              : rf,
          ),
        );
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert(
        error.response?.data?.message || "Failed to update request form status",
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset and reload when filters change
  useEffect(() => {
    setRequestForms([]);
    setCurrentPage(1);
    setHasMore(true);
    setInitialLoad(true);
    handleLoadRequestForms(1, false, debouncedSearch, statusFilter, typeFilter);
  }, [refreshKey, debouncedSearch, statusFilter, typeFilter]);

  // Add scroll listener
  useEffect(() => {
    const ref = tableRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      return () => ref.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] shadow-2xl">
      {/* Header with filters */}
      <div className="p-4 flex flex-wrap justify-between items-center gap-4 border-b border-[#c9a84c]/20 bg-[#1C2B5E]">
        <div className="w-64 min-w-[200px]">
          <FloatingLabelInput
            label="Search"
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#0E1A3A] border border-[#c9a84c]/30 rounded-lg text-slate-300 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/20 text-sm cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-[#0E1A3A] border border-[#c9a84c]/30 rounded-lg text-slate-300 focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/20 text-sm cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="borrow">Borrow</option>
            <option value="maintenance">Maintenance</option>
            <option value="repair">Repair</option>
            <option value="release">Release</option>
          </select>

          <button
            type="button"
            onClick={onAddRequestForm}
            className="px-4 py-2 bg-[#c9a84c] hover:bg-[#b8963e] text-[#1C2B5E] font-semibold rounded-lg shadow-lg shadow-[#c9a84c]/20 border border-[#c9a84c]/40 transition-all cursor-pointer text-sm tracking-wide"
          >
            + Add Request Form
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        ref={tableRef}
        className="relative max-w-full max-h-[calc(100vh-8.5rem)] overflow-auto"
      >
        <Table>
          <TableHeader className="border-b border-[#c9a84c]/30 bg-[#6B1E3C] sticky top-0 text-[#c9a84c] text-xs z-10 uppercase tracking-widest">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-center">
                No.
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Request No.
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Requestor
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Laboratory
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Type
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Date of Use
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Status
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-center">
                Action
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/6 text-slate-300 text-sm bg-[#1C2B5E]">
            {loadingRequestForms && requestForms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="px-4 py-6 text-center">
                  <Spinner size="md" />
                </TableCell>
              </TableRow>
            ) : requestForms.length > 0 ? (
              <>
                {requestForms.map((rf, index) => {
                  const statusColor = getStatusColor(rf.status);
                  const isUpdating = updatingStatusId === rf.request_id;

                  return (
                    <TableRow
                      key={rf.request_id}
                      className="hover:bg-[#6B1E3C]/20 transition-colors duration-150"
                    >
                      <TableCell className="px-4 py-3 text-center">
                        {(currentPage - 1) * 15 + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-sm font-semibold text-[#c9a84c]">
                        {rf.request_number}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rf.requestor?.first_name && rf.requestor?.last_name
                          ? `${rf.requestor.last_name}, ${rf.requestor.first_name}`
                          : rf.requestor_id}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {rf.laboratory?.laboratory || rf.laboratory_id}
                      </TableCell>
                      <TableCell className="px-4 py-3 capitalize">
                        {rf.request_type}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-white font-medium">
                          {formatDate(rf.date_of_use)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <select
                          value={rf.status}
                          onChange={(e) =>
                            handleStatusChange(rf, e.target.value)
                          }
                          disabled={
                            isUpdating ||
                            rf.status === "completed" ||
                            rf.status === "cancelled"
                          }
                          className={`px-2 py-1 rounded-lg text-xs font-medium capitalize border cursor-pointer transition-all ${statusColor} ${
                            isUpdating ? "opacity-50 cursor-not-allowed" : ""
                          } focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/50`}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex gap-4 justify-center">
                          <button
                            type="button"
                            className="text-blue-400 font-medium cursor-pointer hover:text-blue-300 hover:underline transition-colors"
                            onClick={() => onShowRequestForm(rf)}
                          >
                            View
                          </button>
                          {(rf.status === "pending" ||
                            rf.status === "ongoing") && (
                            <button
                              type="button"
                              className="text-[#c9a84c] font-medium cursor-pointer hover:text-[#e8c96a] hover:underline transition-colors"
                              onClick={() => onEditRequestForm(rf)}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            type="button"
                            className="text-red-400 font-medium cursor-pointer hover:text-red-300 hover:underline transition-colors"
                            onClick={() => onDeleteRequestForm(rf)}
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {loadingRequestForms && requestForms.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="px-4 py-3 text-center">
                      <Spinner size="sm" />
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
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

export default RequestFormList;
