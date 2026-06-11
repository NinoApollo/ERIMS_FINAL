import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import type {
  AreaColumns,
  AreaFieldErrors,
} from "../../../interfaces/AreaInterface";
import AreaService from "../../../services/AreaService";

interface EditAreaFormModalProps {
  area: AreaColumns | null;
  onAreaUpdated: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditAreaFormModal: FC<EditAreaFormModalProps> = ({
  area,
  onAreaUpdated,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [errors, setErrors] = useState<AreaFieldErrors>({
    area: [],
  });

  const handleUpdateArea = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await AreaService.updateArea(area?.area_id!, {
        area: areaName,
      });

      if (res.status === 200) {
        setAreaName(res.data.area.area);
        setErrors({ area: [] });
        onAreaUpdated(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected status error occurred during updating area: ",
          res.status,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating area: ",
          error,
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (area) {
        setAreaName(area.area);
        setErrors({ area: [] });
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
        <form onSubmit={handleUpdateArea} className="space-y-6">
          <div className="border-b border-[#c9a84c]/20 pb-4">
            <h1 className="text-2xl font-semibold text-white">Edit Area</h1>
            <p className="mt-2 text-sm text-[#c9a84c]/60">
              Update the area information below.
            </p>
          </div>
          <div className="space-y-4">
            <FloatingLabelInput
              label="Area"
              type="text"
              name="area"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              required
              autoFocus
              errors={errors.area}
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-[#c9a84c]/20 pt-4">
            {!loadingUpdate && <CloseButton label="Close" onClose={onClose} />}
            <SubmitButton
              label="Update Area"
              loading={loadingUpdate}
              loadingLabel="Updating Area..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditAreaFormModal;
