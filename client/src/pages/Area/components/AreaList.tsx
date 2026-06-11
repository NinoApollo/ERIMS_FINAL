import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import Spinner from "../../../components/Spinner/Spinner";
import type { AreaColumns } from "../../../interfaces/AreaInterface";
import AreaService from "../../../services/AreaService";

interface AreaListProps {
  onEditArea: (area: AreaColumns | null) => void;
  onDeleteArea: (area: AreaColumns | null) => void;
  refreshKey: boolean;
}

const AreaList: FC<AreaListProps> = ({
  onEditArea,
  onDeleteArea,
  refreshKey,
}) => {
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [areas, setAreas] = useState<AreaColumns[]>([]);
  const [areasTableCurrentPage, setAreasTableCurrentPage] = useState(1);
  const [areasTableLastPage, setAreasTableLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const tableRef = useRef<HTMLDivElement>(null);

  const handleLoadAreas = async (page: number, append = false) => {
    try {
      setLoadingAreas(true);

      const res = await AreaService.loadAreas(page, "");

      if (res.status === 200) {
        const areasData = res.data.areas.data || res.data.areas || [];
        const lastPage =
          res.data.areas.last_page ||
          res.data.last_page ||
          areasTableLastPage ||
          1;

        setAreas(append ? [...areas, ...areasData] : areasData);
        setAreasTableCurrentPage(page);
        setAreasTableLastPage(lastPage);
        setHasMore(page < lastPage);
      } else {
        setAreas(append ? areas : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading areas: ",
        error,
      );
    } finally {
      setLoadingAreas(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;

    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
      hasMore &&
      !loadingAreas
    ) {
      handleLoadAreas(areasTableCurrentPage + 1, true);
    }
  }, [hasMore, loadingAreas, areasTableCurrentPage]);

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
    setAreas([]);
    setAreasTableCurrentPage(1);
    setHasMore(true);

    handleLoadAreas(1, false);
  }, [refreshKey]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#c9a84c]/20 bg-[#1C2B5E] shadow-xl shadow-black/30">
        <div
          ref={tableRef}
          className="max-w-full max-h-[calc(100vh-20rem)] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
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
                  Area
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
              {loadingAreas && areas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="px-4 py-6 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : areas.length > 0 ? (
                <>
                  {areas.map((area, index) => (
                    <TableRow
                      className="hover:bg-[#c9a84c]/5 transition-colors duration-150"
                      key={area.area_id}
                    >
                      <TableCell className="px-4 py-3 text-center text-slate-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-slate-200">
                        {area.area}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex justify-start items-center gap-4">
                          <button
                            type="button"
                            className="text-[#c9a84c] font-medium cursor-pointer hover:text-[#e8c96a] hover:underline transition-colors"
                            onClick={() => onEditArea(area)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-400 font-medium cursor-pointer hover:text-red-300 hover:underline transition-colors"
                            onClick={() => onDeleteArea(area)}
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {loadingAreas && (
                    <TableRow>
                      <TableCell colSpan={3} className="px-4 py-3 text-center">
                        <Spinner size="md" />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
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

export default AreaList;
