import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import Spinner from "../../../components/Spinner/Spinner";
import type { GenderColumns } from "../../../interfaces/GenderInterface";
import GenderService from "../../../services/GenderService";

interface GenderListProps {
  onEditGender: (gender: GenderColumns | null) => void;
  onDeleteGender: (gender: GenderColumns | null) => void;
  refreshKey: boolean;
}

const GenderList: FC<GenderListProps> = ({
  onEditGender,
  onDeleteGender,
  refreshKey,
}) => {
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColumns[]>([]);
  const [gendersTableCurrentPage, setGendersTableCurrentPage] = useState(1);
  const [gendersTableLastPage, setGendersTableLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const tableRef = useRef<HTMLDivElement>(null);

  const handleLoadGenders = async (page: number, append = false) => {
    try {
      setLoadingGenders(true);

      const res = await GenderService.loadGenders();

      if (res.status === 200) {
        const gendersData = res.data.genders.data || res.data.genders || [];
        const lastPage =
          res.data.genders.last_page ||
          res.data.last_page ||
          gendersTableLastPage ||
          1;

        setGenders(append ? [...genders, ...gendersData] : gendersData);
        setGendersTableCurrentPage(page);
        setGendersTableLastPage(lastPage);
        setHasMore(page < lastPage);
      } else {
        setGenders(append ? genders : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading genders: ",
        error,
      );
    } finally {
      setLoadingGenders(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;

    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
      hasMore &&
      !loadingGenders
    ) {
      handleLoadGenders(gendersTableCurrentPage + 1, true);
    }
  }, [hasMore, loadingGenders, gendersTableCurrentPage]);

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
    setGenders([]);
    setGendersTableCurrentPage(1);
    setHasMore(true);

    handleLoadGenders(1, false);
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
                  Gender
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
              {loadingGenders && genders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="px-4 py-6 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : genders.length > 0 ? (
                <>
                  {genders.map((gender, index) => (
                    <TableRow
                      className="hover:bg-[#c9a84c]/5 transition-colors duration-150"
                      key={gender.gender_id}
                    >
                      <TableCell className="px-4 py-3 text-center text-slate-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-slate-200">
                        {gender.gender}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex justify-start items-center gap-4">
                          <button
                            type="button"
                            className="text-[#c9a84c] font-medium cursor-pointer hover:text-[#e8c96a] hover:underline transition-colors"
                            onClick={() => onEditGender(gender)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-400 font-medium cursor-pointer hover:text-red-300 hover:underline transition-colors"
                            onClick={() => onDeleteGender(gender)}
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {loadingGenders && (
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

export default GenderList;
