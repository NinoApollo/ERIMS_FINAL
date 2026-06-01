import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import LaboratoryService from "../../../services/LaboratoryService";
import Spinner from "../../../components/Spinner/Spinner";
import type { LaboratoryColumns } from "../../../interfaces/LaboratoryInterface";

interface LaboratoryListProps {
  onEditLaboratory: (laboratory: LaboratoryColumns | null) => void;
  onDeleteLaboratory: (laboratory: LaboratoryColumns | null) => void;
  refreshKey: boolean;
}

const LaboratoryList: FC<LaboratoryListProps> = ({
  onEditLaboratory,
  onDeleteLaboratory,
  refreshKey,
}) => {
  const [loadingLaboratories, setLoadingLaboratories] = useState(false);
  const [laboratories, setLaboratories] = useState<LaboratoryColumns[]>([]);
  const [laboratoriesTableCurrentPage, setLaboratoriesTableCurrentPage] =
    useState(1);
  const [laboratoriesTableLastPage, setLaboratoriesTableLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const tableRef = useRef<HTMLDivElement>(null);

  const handleLoadLaboratories = async (page: number, append = false) => {
    try {
      setLoadingLaboratories(true);

      const res = await LaboratoryService.loadLaboratories(page, "");

      if (res.status === 200) {
        const laboratoriesData =
          res.data.laboratories.data || res.data.laboratories || [];
        const lastPage =
          res.data.laboratories.last_page ||
          res.data.last_page ||
          laboratoriesTableLastPage ||
          1;

        setLaboratories(
          append ? [...laboratories, ...laboratoriesData] : laboratoriesData,
        );
        setLaboratoriesTableCurrentPage(page);
        setLaboratoriesTableLastPage(lastPage);
        setHasMore(page < lastPage);
      } else {
        setLaboratories(append ? laboratories : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading laboratories: ",
        error,
      );
    } finally {
      setLoadingLaboratories(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;

    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
      hasMore &&
      !loadingLaboratories
    ) {
      handleLoadLaboratories(laboratoriesTableCurrentPage + 1, true);
    }
  }, [hasMore, loadingLaboratories, laboratoriesTableCurrentPage]);

  useEffect(() => {
    const ref = tableRef.current;

    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref) {
        ref.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    setLaboratories([]);
    setLaboratoriesTableCurrentPage(1);
    setHasMore(true);

    handleLoadLaboratories(1, false);
  }, [refreshKey]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#c9a84c]/20 bg-[#1C2B5E] shadow-xl shadow-black/30">
        <div
          ref={tableRef}
          className="max-w-full max-h-[calc(100vh-20rem)] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <Table>
            <TableHeader className="border-b border-[#c9a84c]/20 bg-[#0E1A3A] sticky top-0 text-xs">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-center text-[#c9a84c]/70 uppercase tracking-wider"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-start text-[#c9a84c]/70 uppercase tracking-wider"
                >
                  Laboratory
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-start text-[#c9a84c]/70 uppercase tracking-wider"
                >
                  Course
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-start text-[#c9a84c]/70 uppercase tracking-wider"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#c9a84c]/10 text-sm">
              {loadingLaboratories && laboratories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-4 py-6 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : laboratories.length > 0 ? (
                <>
                  {laboratories.map((laboratory, index) => (
                    <TableRow
                      className="hover:bg-[#c9a84c]/5 transition-colors duration-150"
                      key={laboratory.laboratory_id}
                    >
                      <TableCell className="px-4 py-3 text-center text-slate-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-slate-200">
                        {laboratory.laboratory}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-slate-300">
                        {laboratory.course.course}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex justify-start items-center gap-4">
                          <button
                            type="button"
                            className="text-[#c9a84c] font-medium cursor-pointer hover:text-[#e8c96a] hover:underline transition-colors"
                            onClick={() => onEditLaboratory(laboratory)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-400 font-medium cursor-pointer hover:text-red-300 hover:underline transition-colors"
                            onClick={() => onDeleteLaboratory(laboratory)}
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {loadingLaboratories && (
                    <TableRow>
                      <TableCell colSpan={4} className="px-4 py-3 text-center">
                        <Spinner size="md" />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
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
    </>
  );
};

export default LaboratoryList;
