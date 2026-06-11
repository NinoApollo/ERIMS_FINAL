// src/pages/Personnels/components/PersonnelList.tsx

import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import PersonnelService from "../../../services/PersonnelService";
import Spinner from "../../../components/Spinner/Spinner";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { PersonnelColumns } from "../../../interfaces/PersonnelInterface";

interface PersonnelListProps {
  onAddPersonnel: () => void;
  onEditPersonnel: (personnel: PersonnelColumns | null) => void;
  onDeletePersonnel: (personnel: PersonnelColumns | null) => void;
  refreshKey: boolean;
}

const PersonnelList: FC<PersonnelListProps> = ({
  onAddPersonnel,
  onEditPersonnel,
  onDeletePersonnel,
  refreshKey,
}) => {
  const [loadingPersonnels, setLoadingPersonnels] = useState(false);
  const [personnels, setPersonnels] = useState<PersonnelColumns[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const tableRef = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loadingPersonnels);
  const currentPageRef = useRef(currentPage);
  const debouncedSearchRef = useRef(debouncedSearch);

  hasMoreRef.current = hasMore;
  loadingRef.current = loadingPersonnels;
  currentPageRef.current = currentPage;
  debouncedSearchRef.current = debouncedSearch;

  const handleLoadPersonnels = async (
    page: number,
    append = false,
    searchTerm = debouncedSearchRef.current,
  ) => {
    try {
      setLoadingPersonnels(true);

      const res = await PersonnelService.loadPersonnels(page, searchTerm);

      if (res.status === 200) {
        const personnelsData =
          res.data.personnels.data || res.data.personnels || [];
        const totalPages = res.data.personnels.last_page || 1;

        setPersonnels((prev) =>
          append ? [...prev, ...personnelsData] : personnelsData,
        );
        setCurrentPage(page);
        setHasMore(page < totalPages);
      } else {
        setPersonnels(append ? personnels : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading personnels:", error);
    } finally {
      setLoadingPersonnels(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;
    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
      hasMoreRef.current &&
    !loadingRef.current
    ) {
      handleLoadPersonnels(
        currentPageRef.current + 1,
        true,
        debouncedSearchRef.current,
      );
    }
  }, []);

  const getFullName = (personnel: PersonnelColumns) => {
    let name = `${personnel.last_name}, ${personnel.first_name}`;
    if (personnel.middle_name) {
      name += ` ${personnel.middle_name.charAt(0)}.`;
    }
    if (personnel.suffix_name) {
      name += ` ${personnel.suffix_name}`;
    }
    return name;
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 800);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPersonnels([]);
    setCurrentPage(1);
    setHasMore(true);
    handleLoadPersonnels(1, false, debouncedSearch);
  }, [refreshKey, debouncedSearch]);

  useEffect(() => {
    const ref = tableRef.current;
    if (ref) ref.addEventListener("scroll", handleScroll);
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] shadow-2xl">
      <div className="p-4 flex justify-between border-b border-[#c9a84c]/20 bg-[#1C2B5E]">
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
        <button
          type="button"
          onClick={onAddPersonnel}
          className="px-4 py-2 bg-[#c9a84c] hover:bg-[#b8963e] text-[#1C2B5E] font-semibold rounded-lg shadow-lg shadow-[#c9a84c]/20 border border-[#c9a84c]/40 transition cursor-pointer text-sm tracking-wide"
        >
          Add Personnel
        </button>
      </div>

      <div
        ref={tableRef}
        className="relative max-w-full max-h-[calc(100vh-8.5rem)] overflow-x-auto"
      >
        <Table>
          <TableHeader className="border-b border-[#c9a84c]/30 bg-[#6B1E3C] sticky top-0 text-[#c9a84c] text-xs z-10 uppercase tracking-widest">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-center">
                No.
              </TableCell>
              <TableCell
                isHeader
                colSpan={2}
                className="px-5 py-3 font-medium text-start"
              >
                Full Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Role
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Department
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Username
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
            {loadingPersonnels && personnels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="px-4 py-6 text-center">
                  <Spinner size="md" />
                </TableCell>
              </TableRow>
            ) : personnels.length > 0 ? (
              <>
                {personnels.map((personnel, index) => (
                  <TableRow
                    key={personnel.personnel_id}
                    className="hover:bg-[#6B1E3C]/20 transition-colors duration-150"
                  >
                    <TableCell className="px-4 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-3">
                      {personnel.profile_picture ? (
                        <img
                          src={personnel.profile_picture}
                          alt={getFullName(personnel)}
                          className="object-cover w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="relative inline-flex items-center justify-center w-10 h-10 text-center text-sm overflow-hidden bg-[#c9a84c]/15 border border-[#c9a84c]/30 rounded-full">
                          <span className="font-semibold text-[#c9a84c]">
                            {`${personnel.last_name.charAt(0)}${personnel.first_name.charAt(0)}`}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {getFullName(personnel)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {personnel.role?.role || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {personnel.department?.department || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {personnel.username}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          personnel.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {personnel.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          className="text-[#c9a84c] font-medium cursor-pointer hover:text-[#e8c96a] hover:underline transition-colors"
                          onClick={() => onEditPersonnel(personnel)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-400 font-medium cursor-pointer hover:text-red-300 hover:underline transition-colors"
                          onClick={() => onDeletePersonnel(personnel)}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {loadingPersonnels && (
                  <TableRow>
                    <TableCell colSpan={8} className="px-4 py-3 text-center">
                      <Spinner size="md" />
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

export default PersonnelList;
