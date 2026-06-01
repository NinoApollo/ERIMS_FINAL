import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import RoleService from "../../../services/RoleService";
import type { RoleFieldErrors } from "../../../interfaces/RoleInterface";

interface AddRoleFormProps {
  onRoleAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddRoleForm: FC<AddRoleFormProps> = ({ onRoleAdded, refreshKey }) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState<RoleFieldErrors>({});

  const handleStoreRole = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await RoleService.storeRole({ role });

      if (res.status === 200) {
        setRole("");
        setErrors({});
        onRoleAdded(res.data.message);
        refreshKey();
      } else {
        console.error("Unexpected error occured during store role: ", res.data);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occured during store role: ",
          error,
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleStoreRole}
        className="rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] p-6 shadow-xl shadow-black/30"
      >
        <div className="mb-4">
          <FloatingLabelInput
            label="Role"
            type="text"
            name="gender"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            autoFocus
            errors={errors.role}
          />
        </div>
        <div className="flex justify-end pt-3 border-t border-[#c9a84c]/20">
          <SubmitButton
            label="Add Role"
            loading={loadingStore}
            loadingLabel="Adding Role..."
          />
        </div>
      </form>
    </>
  );
};

export default AddRoleForm;
