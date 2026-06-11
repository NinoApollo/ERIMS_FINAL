// src/pages/Equipment/components/DeleteEquipmentFormModal.tsx

import { useEffect, useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import EquipmentService from "../../../services/EquipmentService";
import type { EquipmentColumns } from "../../../interfaces/EquipmentInterface";

interface DeleteEquipmentFormModalProps {
  equipment: EquipmentColumns | null;
  onEquipmentDeleted: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteEquipmentFormModal: FC<DeleteEquipmentFormModalProps> = ({
  equipment,
  onEquipmentDeleted,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [equipmentCode, setEquipmentCode] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [areaName, setAreaName] = useState("");

  const handleDestroyEquipment = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!equipment) {
        console.error("No equipment data available");
        return;
      }

      setLoadingDestroy(true);

      const res = await EquipmentService.destroyEquipment(
        equipment.equipment_id,
      );

      if (res.status === 200) {
        onEquipmentDeleted(
          res.data.message || "Equipment successfully deleted",
        );
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected status error occurred during deleting equipment: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting equipment: ",
        error,
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    if (isOpen && equipment) {
      setEquipmentCode(equipment.equipment_code || "");
      setEquipmentName(equipment.equipment_name || "");
      setCategoryName(equipment.category?.category || "N/A");
      setAreaName(equipment.area?.area || "N/A");
    }
  }, [isOpen, equipment]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleDestroyEquipment}>
        <h1 className="text-2xl border-b border-[#c9a84c]/20 p-4 font-semibold mb-4 text-white">
          Delete Equipment
        </h1>
        <div className="grid grid-cols-1 gap-4 border-b border-[#c9a84c]/20 mb-4 p-4">
          <div className="mb-4">
            <label
              htmlFor="equipment_code"
              className="text-[#c9a84c]/70 text-xs font-semibold tracking-wider uppercase block mb-1"
            >
              Equipment Code
            </label>
            <p className="text-slate-200 font-mono text-sm">
              {equipmentCode || "N/A"}
            </p>
          </div>
          <div className="mb-4">
            <label
              htmlFor="equipment_name"
              className="text-[#c9a84c]/70 text-xs font-semibold tracking-wider uppercase block mb-1"
            >
              Equipment Name
            </label>
            <p className="text-slate-200 font-medium">
              {equipmentName || "N/A"}
            </p>
          </div>
          <div className="mb-4">
            <label
              htmlFor="category"
              className="text-[#c9a84c]/70 text-xs font-semibold tracking-wider uppercase block mb-1"
            >
              Category
            </label>
            <p className="text-slate-200 font-medium">{categoryName}</p>
          </div>
          <div className="mb-4">
            <label
              htmlFor="area"
              className="text-[#c9a84c]/70 text-xs font-semibold tracking-wider uppercase block mb-1"
            >
              Area
            </label>
            <p className="text-slate-200 font-medium">{areaName}</p>
          </div>
          <div className="mb-4">
            <p className="text-red-400 text-sm">
              ⚠️ Warning: This action cannot be undone. This will permanently
              delete the equipment record.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4">
          {!loadingDestroy && <CloseButton label="Close" onClose={onClose} />}
          <SubmitButton
            newClassName="px-4 py-3 bg-[#6B1E3C] hover:bg-[#7d2347] text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg shadow-[#6B1E3C]/30 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            label="Delete Equipment"
            loading={loadingDestroy}
            loadingLabel="Deleting Equipment..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default DeleteEquipmentFormModal;
