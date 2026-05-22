import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import RoleService from "../../../services/RoleService";
import type { RoleFieldErrors } from "../../../interfaces/RoleFieldErrors";

interface AddRoleFormProps {
  onRoleAdded: (message: string) => void;
}

const AddRoleForm: FC<AddRoleFormProps> = ({ onRoleAdded }) => {
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
      <form onSubmit={handleStoreRole}>
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
        <div className="flex justify-end">
          <SubmitButton
            label="Save Role"
            loading={loadingStore}
            loadingLabel="Saving Role..."
          />
        </div>
      </form>
    </>
  );
};

export default AddRoleForm;
