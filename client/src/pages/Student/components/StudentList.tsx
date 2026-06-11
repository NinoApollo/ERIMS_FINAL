// src/pages/Students/components/StudentList.tsx

import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import StudentService from "../../../services/StudentService";
import Spinner from "../../../components/Spinner/Spinner";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { StudentColumns } from "../../../interfaces/StudentInterface";

interface StudentListProps {
  onAddStudent: () => void;
  onEditStudent: (student: StudentColumns | null) => void;
  onDeleteStudent: (student: StudentColumns | null) => void;
  refreshKey: boolean;
}

const StudentList: FC<StudentListProps> = ({
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  refreshKey,
}) => {
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [students, setStudents] = useState<StudentColumns[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const tableRef = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loadingStudents);
  const currentPageRef = useRef(currentPage);
  const debouncedSearchRef = useRef(debouncedSearch);

  hasMoreRef.current = hasMore;
  loadingRef.current = loadingStudents;
  currentPageRef.current = currentPage;
  debouncedSearchRef.current = debouncedSearch;

  const handleLoadStudents = async (page: number, append = false) => {
    try {
      setLoadingStudents(true);

      const res = await StudentService.loadStudents(page, debouncedSearch);

      if (res.status === 200) {
        const studentsData = res.data.students.data || res.data.students || [];
        const totalPages = res.data.students.last_page || 1;

        setStudents((prev) =>
          append ? [...prev, ...studentsData] : studentsData,
        );
        setCurrentPage(page);
        setHasMore(page < totalPages);
      } else {
        setStudents(append ? students : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoadingStudents(false);
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
      handleLoadStudents(currentPageRef.current + 1, true);
    }
  }, []);

  const getFullName = (student: StudentColumns) => {
    let name = `${student.last_name}, ${student.first_name}`;
    if (student.middle_name) {
      name += ` ${student.middle_name.charAt(0)}.`;
    }
    if (student.suffix_name) {
      name += ` ${student.suffix_name}`;
    }
    return name;
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 800);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setStudents([]);
    setCurrentPage(1);
    setHasMore(true);
    handleLoadStudents(1, false);
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
          onClick={onAddStudent}
          className="px-4 py-2 bg-[#c9a84c] hover:bg-[#b8963e] text-[#1C2B5E] font-semibold rounded-lg shadow-lg shadow-[#c9a84c]/20 border border-[#c9a84c]/40 transition cursor-pointer text-sm tracking-wide"
        >
          Add Student
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
                Course
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Year Level
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Department
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
            {loadingStudents && students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="px-4 py-6 text-center">
                  <Spinner size="md" />
                </TableCell>
              </TableRow>
            ) : students.length > 0 ? (
              <>
                {students.map((student, index) => (
                  <TableRow
                    key={student.student_id}
                    className="hover:bg-[#6B1E3C]/20 transition-colors duration-150"
                  >
                    <TableCell className="px-4 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-3">
                      {student.profile_picture ? (
                        <img
                          src={student.profile_picture}
                          alt={getFullName(student)}
                          className="object-cover w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="relative inline-flex items-center justify-center w-10 h-10 text-center text-sm overflow-hidden bg-[#c9a84c]/15 border border-[#c9a84c]/30 rounded-full">
                          <span className="font-semibold text-[#c9a84c]">
                            {`${student.last_name.charAt(0)}${student.first_name.charAt(0)}`}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {getFullName(student)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {student.course?.course || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {student.year_level?.year_level || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {student.department?.department || "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {student.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex gap-4 justify-center">
                        <button
                          type="button"
                          className="text-[#c9a84c] font-medium cursor-pointer hover:text-[#e8c96a] hover:underline transition-colors"
                          onClick={() => onEditStudent(student)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-400 font-medium cursor-pointer hover:text-red-300 hover:underline transition-colors"
                          onClick={() => onDeleteStudent(student)}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {loadingStudents && (
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

export default StudentList;
