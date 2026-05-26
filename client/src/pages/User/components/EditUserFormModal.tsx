import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import UserService from "../../../services/UserService";
import type { RoleColumns } from "../../../interfaces/RoleInterface";
import type {
  UserColumns,
  UserFieldErrors,
} from "../../../interfaces/UserInterface";
import RoleService from "../../../services/RoleService";

interface EditUserFormModalProps {
  user: UserColumns | null;
  onUserUpdated: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditUserFormModal: FC<EditUserFormModalProps> = ({
  user,
  onUserUpdated,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roles, setRoles] = useState<RoleColumns[]>([]);

  const [loadingUpate, setLoadingUpdate] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [role, setRole] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<UserFieldErrors>({});

  const handleUpdateUser = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const payload = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        suffix_name: suffixName,
        role: role,
        birth_date: birthDate,
        username: username,
      };

      const res = await UserService.updateUser(user?.user_id!, payload);

      if (res.status === 200) {
        setFirstName(res.data.userfirst_name);
        setMiddleName(res.data.usermiddle_name ?? "");
        setLastName(res.data.userlast_name);
        setSuffixName(res.data.usersuffix_name ?? "");
        setRole(res.data.user.role_id);
        setBirthDate(res.data.userbirth_date);
        setUsername(res.data.user.username);
        setErrors({});

        onUserUpdated(res.data.message);

        handleLoadRoles();
        refreshKey();
      } else {
        console.error(
          "Unexpected status error occurred during updating user: ",
          res.status,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating user: ",
          error,
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleLoadRoles = async () => {
    try {
      setLoadingRoles(true);

      const res = await RoleService.loadRoles();

      if (res.status === 200) {
        setRoles(res.data.roles);
      } else {
        console.error(
          "Unexpected status error occurred during loading roles: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading roles: ",
        error,
      );
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadRoles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFirstName(user.first_name);
        setMiddleName(user.middle_name ?? "");
        setLastName(user.last_name);
        setSuffixName(user.suffix_name ?? "");
        setRole(user.role.role_id.toString());
        setBirthDate(user.birth_date);
        setUsername(user.username);
      } else {
        console.error(
          "Unexpected user error occurred during getting user details: ",
          user,
        );
      }
    }
  }, [isOpen, user]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleUpdateUser}>
          <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
            Edit User Form
          </h1>
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <FloatingLabelInput
                  label="First Name"
                  type="text"
                  name="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoFocus
                  errors={errors.first_name}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Middle Name"
                  type="text"
                  name="middle_name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  errors={errors.middle_name}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Last Name"
                  type="text"
                  name="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  errors={errors.last_name}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Suffix Name"
                  type="text"
                  name="suffix_name"
                  value={suffixName}
                  onChange={(e) => setSuffixName(e.target.value)}
                  errors={errors.suffix_name}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelSelect
                  label="Role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  errors={errors.role}
                >
                  {loadingRoles ? (
                    <option value="">Loading...</option>
                  ) : (
                    <>
                      <option value="">Select Role</option>
                      {roles.map((role, index) => (
                        <option value={role.role_id} key={index}>
                          {role.role}
                        </option>
                      ))}
                    </>
                  )}
                </FloatingLabelSelect>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <FloatingLabelInput
                  label="Birth Date"
                  type="date"
                  name="birth_date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  errors={errors.birth_date}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  errors={errors.username}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {!loadingUpate && <CloseButton label="Close" onClose={onClose} />}
            <SubmitButton
              label="Update User"
              loading={loadingUpate}
              loadingLabel="Updating User..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default EditUserFormModal;
