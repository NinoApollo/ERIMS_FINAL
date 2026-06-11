// src/pages/Equipment/components/EquipmentList.tsx

import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import EquipmentService from "../../../services/EquipmentService";
import Spinner from "../../../components/Spinner/Spinner";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { EquipmentColumns } from "../../../interfaces/EquipmentInterface";

interface EquipmentListProps {
  onAddEquipment: () => void;
  onEditEquipment: (equipment: EquipmentColumns | null) => void;
  onDeleteEquipment: (equipment: EquipmentColumns | null) => void;
  refreshKey: boolean;
}

interface LoadEquipmentsResponse {
  equipments: {
    data: EquipmentColumns[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const getStatusBadge = (status: string) => {
  const badges: Record<string, { label: string; className: string }> = {
    available: {
      label: "Available",
      className:
        "bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium",
    },
    in_use: {
      label: "In Use",
      className:
        "bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium",
    },
    borrowed: {
      label: "Borrowed",
      className:
        "bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-medium",
    },
    maintenance: {
      label: "Under Maintenance",
      className:
        "bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium",
    },
    lost: {
      label: "Lost",
      className:
        "bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium",
    },
    returned: {
      label: "Returned",
      className:
        "bg-slate-500/20 text-slate-400 px-2 py-1 rounded-full text-xs font-medium",
    },
  };
  return (
    badges[status] || {
      label: status,
      className:
        "bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs font-medium",
    }
  );
};

const getConditionBadge = (condition: string) => {
  const badges: Record<string, { label: string; className: string }> = {
    new: {
      label: "New",
      className:
        "bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium",
    },
    good: {
      label: "Good",
      className:
        "bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium",
    },
    fair: {
      label: "Fair",
      className:
        "bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium",
    },
    damaged: {
      label: "Damaged",
      className:
        "bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium",
    },
  };
  return (
    badges[condition] || {
      label: condition,
      className:
        "bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs font-medium",
    }
  );
};

const getEquipmentInitial = (equipmentName: string) => {
  return equipmentName.trim().charAt(0).toUpperCase() || "E";
};

const EquipmentList: FC<EquipmentListProps> = ({
  onAddEquipment,
  onEditEquipment,
  onDeleteEquipment,
  refreshKey,
}) => {
  useEffect(() => {
    document.title = "Equipment List Page";
  }, []);

  const [loadingEquipments, setLoadingEquipments] = useState(false);
  const [equipments, setEquipments] = useState<EquipmentColumns[]>([]);
  const [equipmentsTableCurrentPage, setEquipmentsTableCurrentPage] =
    useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const tableRef = useRef<HTMLDivElement>(null);

  const hasMoreRef = useRef(hasMore);
  const loadingEquipmentsRef = useRef(loadingEquipments);
  const currentPageRef = useRef(equipmentsTableCurrentPage);
  const debouncedSearchRef = useRef(debouncedSearch);

  hasMoreRef.current = hasMore;
  loadingEquipmentsRef.current = loadingEquipments;
  currentPageRef.current = equipmentsTableCurrentPage;
  debouncedSearchRef.current = debouncedSearch;

  const handleLoadEquipments = async (
    page: number,
    append = false,
    searchTerm: string,
  ) => {
    try {
      setLoadingEquipments(true);

      const res = (await EquipmentService.loadEquipments(page, searchTerm)) as {
        data: LoadEquipmentsResponse;
        status: number;
      };

      if (res.status === 200) {
        const equipmentsData =
          res.data.equipments.data || res.data.equipments || [];
        const lastPage = res.data.equipments.last_page || 1;

        setEquipments((prev) =>
          append ? [...prev, ...equipmentsData] : equipmentsData,
        );
        setEquipmentsTableCurrentPage(page);
        setHasMore(page < lastPage);
      } else {
        setEquipments((prev) => (append ? prev : []));
        setHasMore(false);
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading equipments: ",
        error,
      );
    } finally {
      setLoadingEquipments(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;

    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
      hasMoreRef.current &&
      !loadingEquipmentsRef.current
    ) {
      handleLoadEquipments(
        currentPageRef.current + 1,
        true,
        debouncedSearchRef.current,
      );
    }
  }, []);

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
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setEquipments([]);
    setEquipmentsTableCurrentPage(1);
    setHasMore(true);

    handleLoadEquipments(1, false, debouncedSearch);
  }, [refreshKey, debouncedSearch]);

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
          className="px-4 py-2 bg-[#c9a84c] hover:bg-[#b8963e] text-[#1C2B5E] font-semibold rounded-lg shadow-lg shadow-[#c9a84c]/20 border border-[#c9a84c]/40 transition cursor-pointer text-sm tracking-wide"
          onClick={onAddEquipment}
        >
          Add Equipment
        </button>
      </div>

      <div
        ref={tableRef}
        className="relative max-w-full max-h-[calc(100vh-8.5rem)] overflow-x-auto scrollbar-none"
      >
        <Table>
          <TableHeader className="border-b border-[#c9a84c]/30 bg-[#6B1E3C] sticky top-0 text-[#c9a84c] text-xs z-10 uppercase tracking-widest">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-center">
                No.
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Code
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Image
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Equipment Name
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Brand/Model
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Serial No.
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Category
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Area
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Qty/Avail
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-start">
                Condition
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
            {loadingEquipments && equipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="px-4 py-6 text-center">
                  <Spinner size="md" />
                </TableCell>
              </TableRow>
            ) : equipments.length > 0 ? (
              <>
                {equipments.map((equipment, index) => {
                  const statusBadge = getStatusBadge(equipment.status);
                  const conditionBadge = getConditionBadge(equipment.condition);
                  return (
                    <TableRow
                      className="hover:bg-[#6B1E3C]/20 transition-colors duration-150"
                      key={equipment.equipment_id}
                    >
                      <TableCell className="px-4 py-3 text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-xs font-medium text-[#c9a84c]">
                        {equipment.equipment_code}
                      </TableCell>
                      <TableCell className="py-3">
                        {equipment.image ? (
                          <img
                            src={equipment.image}
                            alt={equipment.equipment_name}
                            className="object-cover w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="relative inline-flex items-center justify-center w-10 h-10 text-center text-sm overflow-hidden bg-[#c9a84c]/15 border border-[#c9a84c]/30 rounded-full">
                            <span className="font-semibold text-[#c9a84c]">
                              {getEquipmentInitial(equipment.equipment_name)}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-medium text-white">
                        {equipment.equipment_name}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {equipment.brand || "-"} / {equipment.model || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-xs">
                        {equipment.serial_number || (
                          <span className="text-slate-500 italic">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {equipment.category?.category || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {equipment.area?.area || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="font-medium">
                          {equipment.quantity}/{equipment.available_quantity}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          {equipment.unit}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className={conditionBadge.className}>
                          {conditionBadge.label}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className={statusBadge.className}>
                          {statusBadge.label}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex gap-4 justify-center">
                          <button
                            type="button"
                            className="text-[#c9a84c] font-medium cursor-pointer hover:text-[#e8c96a] hover:underline transition-colors"
                            onClick={() => onEditEquipment(equipment)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-400 font-medium cursor-pointer hover:text-red-300 hover:underline transition-colors"
                            onClick={() => onDeleteEquipment(equipment)}
                          >
                            Delete
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {loadingEquipments && (
                  <TableRow>
                    <TableCell colSpan={12} className="px-4 py-3 text-center">
                      <Spinner size="md" />
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
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

export default EquipmentList;
