import { useEffect, useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import type { AreaColumns } from "../../../interfaces/AreaInterface";
import AreaService from "../../../services/AreaService";

interface DeleteAreaFormModalProps {
  area: AreaColumns | null;
  onAreaDeleted: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAreaFormModal: FC<DeleteAreaFormModalProps> = ({
  area,
  onAreaDeleted,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [areaName, setAreaName] = useState("");

  const handleDestroyArea = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingDestroy(true);

      const res = await AreaService.destroyArea(area?.area_id!);

      if (res.status === 200) {
        onAreaDeleted(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected status error occurred during deleting area: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting area: ",
        error,
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (area) {
        setAreaName(area.area);
      } else {
        console.error(
          "Unexpected area error occurred during getting area details: ",
          area,
        );
      }
    }
  }, [isOpen, area]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleDestroyArea}>
          <h1 className="text-2xl border-b border-[#c9a84c]/20 p-4 font-semibold mb-4 text-white">
            Delete Area
          </h1>
          <div className="grid grid-cols-1 gap-4 border-b border-[#c9a84c]/20 mb-4">
            <div className="mb-4">
              <label
                htmlFor="area"
                className="text-[#c9a84c]/70 text-xs font-semibold tracking-wider uppercase block mb-1"
              >
                Area
              </label>
              <p className="text-slate-200 font-medium">{areaName}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <CloseButton label="Close" onClose={onClose} />}
            <SubmitButton
              newClassName="px-4 py-3 bg-[#6B1E3C] hover:bg-[#7d2347] text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg shadow-[#6B1E3C]/30 border border-[#c9a84c]/20 hover:border-[#c9a84c]/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              label="Delete Area"
              loading={loadingDestroy}
              loadingLabel="Deleting Area..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DeleteAreaFormModal;
