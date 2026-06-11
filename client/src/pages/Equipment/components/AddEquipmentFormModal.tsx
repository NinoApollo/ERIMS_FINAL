// src/pages/Equipment/components/AddEquipmentFormModal.tsx

import { useEffect, useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import CloseButton from "../../../components/Button/CloseButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import Modal from "../../../components/Modal";
import UploadInput from "../../../components/Input/UploadInput";
import type { EquipmentFieldErrors } from "../../../interfaces/EquipmentInterface";
import type { CategoryColumns } from "../../../interfaces/CategoryInterface";
import type { Area } from "../../../interfaces/SharedInterfaces";
import EquipmentService from "../../../services/EquipmentService";
import CategoryService from "../../../services/CategoryService";
import AreaService from "../../../services/AreaService";

interface AddEquipmentFormModalProps {
  onEquipmentAdded: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const CONDITION_OPTIONS = [
  { value: "new", label: "New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "damaged", label: "Damaged" },
];

const STATUS_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "in_use", label: "In Use" },
  { value: "borrowed", label: "Borrowed" },
  { value: "maintenance", label: "Under Maintenance" },
  { value: "lost", label: "Lost" },
  { value: "returned", label: "Returned" },
];

const UNIT_OPTIONS = [
  { value: "pcs", label: "Pieces (pcs)" },
  { value: "set", label: "Set" },
  { value: "unit", label: "Unit" },
];

const AddEquipmentFormModal: FC<AddEquipmentFormModalProps> = ({
  onEquipmentAdded,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [categories, setCategories] = useState<CategoryColumns[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [equipmentCode, setEquipmentCode] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [availableQuantity, setAvailableQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<"pcs" | "set" | "unit">("pcs");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [errors, setErrors] = useState<EquipmentFieldErrors>({});

  const handleLoadCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await CategoryService.loadCategories();
      if (res.status === 200) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleLoadAreas = async () => {
    try {
      setLoadingAreas(true);
      const res = await AreaService.loadAreas(1, "");
      if (res.status === 200) {
        const areasData = res.data.areas.data || res.data.areas || [];
        setAreas(areasData);
      }
    } catch (error) {
      console.error("Error loading areas:", error);
    } finally {
      setLoadingAreas(false);
    }
  };

  const handleStoreEquipment = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const formData = new FormData();

      if (image) {
        formData.append("image", image);
      }

      formData.append("equipment_code", equipmentCode);
      formData.append("equipment_name", equipmentName);
      if (brand) formData.append("brand", brand);
      if (model) formData.append("model", model);
      if (serialNumber) formData.append("serial_number", serialNumber);
      if (description) formData.append("description", description);
      formData.append("category_id", categoryId);
      formData.append("area_id", areaId);
      formData.append("quantity", quantity.toString());
      formData.append("available_quantity", availableQuantity.toString());
      formData.append("unit", unit);
      if (purchaseDate) formData.append("purchase_date", purchaseDate);
      if (purchaseCost) formData.append("purchase_cost", purchaseCost);
      formData.append("condition", condition);
      formData.append("status", status);
      if (remarks) formData.append("remarks", remarks);

      const res = await EquipmentService.storeEquipment(formData);

      if (res.status === 200) {
        setImage(null);
        setEquipmentCode("");
        setEquipmentName("");
        setBrand("");
        setModel("");
        setSerialNumber("");
        setDescription("");
        setCategoryId("");
        setAreaId("");
        setQuantity(1);
        setAvailableQuantity(1);
        setUnit("pcs");
        setPurchaseDate("");
        setPurchaseCost("");
        setCondition("");
        setStatus("");
        setRemarks("");
        setErrors({});

        onEquipmentAdded(res.data.message || "Equipment successfully saved");
        refreshKey();
        onClose();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error storing equipment:", error);
      }
    } finally {
      setLoadingStore(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadCategories();
      handleLoadAreas();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      className="sm:max-w-2xl md:max-w-4xl"
    >
      <form onSubmit={handleStoreEquipment} className="space-y-6">
        <div className="border-b border-[#c9a84c]/20 pb-4">
          <h1 className="text-2xl font-semibold text-white">
            Add Equipment Form
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter the new equipment information to add a record.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-[#c9a84c]/20 pb-4 max-h-[64vh] overflow-y-auto pr-2">
          {/* Image Upload */}
          <div className="col-span-2 rounded-lg border border-[#c9a84c]/15 bg-[#0E1A3A]/30 p-4">
            <UploadInput
              label="Equipment Image"
              name="image"
              value={image}
              onChange={setImage}
              errors={errors.image}
            />
          </div>

          {/* Basic Information */}
          <div className="col-span-2 pt-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#c9a84c] mb-1">
              Basic Information
            </h3>
            <p className="text-xs text-slate-400">Identify the item and its optional reference details.</p>
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelInput
              label="Equipment Code"
              type="text"
              name="equipment_code"
              value={equipmentCode}
              onChange={(e) => setEquipmentCode(e.target.value.toUpperCase())}
              required
              autoFocus
              errors={errors.equipment_code}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelInput
              label="Equipment Name"
              type="text"
              name="equipment_name"
              value={equipmentName}
              onChange={(e) => setEquipmentName(e.target.value)}
              required
              errors={errors.equipment_name}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelInput
              label="Brand"
              type="text"
              name="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              errors={errors.brand}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelInput
              label="Model"
              type="text"
              name="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              errors={errors.model}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelInput
              label="Serial Number"
              type="text"
              name="serial_number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              errors={errors.serial_number}
            />
          </div>

          <div className="col-span-2">
            <FloatingLabelInput
              label="Description"
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              errors={errors.description}
            />
          </div>

          {/* Classification */}
          <div className="col-span-2 mt-2 pt-4 border-t border-[#c9a84c]/15">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#c9a84c] mb-1">
              Classification
            </h3>
            <p className="text-xs text-slate-400">Place the equipment in the right category and area.</p>
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelSelect
              label="Category"
              name="category_id"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              errors={errors.category_id}
            >
              <option value="">Select Category</option>
              {loadingCategories ? (
                <option value="">Loading...</option>
              ) : (
                categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category}
                  </option>
                ))
              )}
            </FloatingLabelSelect>
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelSelect
              label="Area"
              name="area_id"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              required
              errors={errors.area_id}
            >
              <option value="">Select Area</option>
              {loadingAreas ? (
                <option value="">Loading...</option>
              ) : (
                areas.map((area) => (
                  <option key={area.area_id} value={area.area_id}>
                    {area.area}
                  </option>
                ))
              )}
            </FloatingLabelSelect>
          </div>

          {/* Quantity Information */}
          <div className="col-span-2 mt-2 pt-4 border-t border-[#c9a84c]/15">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#c9a84c] mb-1">
              Quantity Information
            </h3>
            <p className="text-xs text-slate-400">Track total stock and the quantity currently available.</p>
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelInput
              label="Total Quantity"
              type="text"
              name="quantity"
              value={quantity.toString()}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setQuantity(isNaN(val) ? 1 : val);
              }}
              required
              errors={errors.quantity}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelInput
              label="Available Quantity"
              type="text"
              name="available_quantity"
              value={availableQuantity.toString()}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setAvailableQuantity(isNaN(val) ? 0 : val);
              }}
              required
              errors={errors.available_quantity}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelSelect
              label="Unit"
              name="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              required
              errors={errors.unit}
            >
              {UNIT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FloatingLabelSelect>
          </div>

          {/* Purchase Information */}
          <div className="col-span-2 mt-2 pt-4 border-t border-[#c9a84c]/15">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#c9a84c] mb-1">
              Purchase Information
            </h3>
            <p className="text-xs text-slate-400">Optional acquisition details for inventory records.</p>
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelInput
              label="Purchase Date"
              type="date"
              name="purchase_date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              errors={errors.purchase_date}
            />
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelInput
              label="Purchase Cost"
              type="text"
              name="purchase_cost"
              value={purchaseCost}
              onChange={(e) => {
                // Allow only numbers and decimal point
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setPurchaseCost(value);
                }
              }}
              errors={errors.purchase_cost}
            />
          </div>

          {/* Status Information */}
          <div className="col-span-2 mt-2 pt-4 border-t border-[#c9a84c]/15">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#c9a84c] mb-1">
              Status Information
            </h3>
            <p className="text-xs text-slate-400">Set the current condition and availability status.</p>
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelSelect
              label="Condition"
              name="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              errors={errors.condition}
            >
              <option value="">Select Condition</option>
              {CONDITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FloatingLabelSelect>
          </div>

          <div className="col-span-2 md:col-span-1">
            <FloatingLabelSelect
              label="Status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              errors={errors.status}
            >
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FloatingLabelSelect>
          </div>

          <div className="col-span-2">
            <FloatingLabelInput
              label="Remarks"
              type="text"
              name="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              errors={errors.remarks}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#c9a84c]/20 pt-4">
          {!loadingStore && <CloseButton label="Close" onClose={onClose} />}
          <SubmitButton
            label="Save Equipment"
            loading={loadingStore}
            loadingLabel="Saving Equipment..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddEquipmentFormModal;
