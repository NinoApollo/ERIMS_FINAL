import { useEffect, useState, type FC, type FormEvent } from "react";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import SubmitButton from "../../../components/Button/SubmitButton";
import CloseButton from "../../../components/Button/CloseButton";
import RoleService from "../../../services/RoleService";
import UserService from "../../../services/UserService";
import type { RoleColumns } from "../../../interfaces/RoleInterface";
import type { UserFieldErrors } from "../../../interfaces/UserInterface";
import UploadInput from "../../../components/Input/UploadInput";

interface AddUserFormModalProps {
  onUserAdded: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
  refreshKey: () => void;
}

const AddUserFormModal: FC<AddUserFormModalProps> = ({
  onUserAdded,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roles, setRoles] = useState<RoleColumns[]>([]);

  const [loadingStore, setLoadingStore] = useState(false);
  const [addUserProfilePicture, setAddUserProfilePicture] =
    useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [role, setRole] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<UserFieldErrors>({});

  const handleStoreUSer = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const formData = new FormData();

      if (addUserProfilePicture) {
        formData.append("add_user_profile_picture", addUserProfilePicture);
      }

      formData.append("first_name", firstName);
      formData.append("middle_name", middleName || "");
      formData.append("last_name", lastName);
      formData.append("suffix_name", suffixName || "");
      formData.append("role", role);
      formData.append("birth_date", birthDate);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);

      const res = await UserService.storeUser(formData);

      if (res.status === 200) {
        setAddUserProfilePicture(null);
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setSuffixName("");
        setRole("");
        setBirthDate("");
        setUsername("");
        setPassword("");
        setPasswordConfirmation("");
        setErrors({});

        onUserAdded(res.data.message);
        refreshKey();
        handleLoadRoles();
      } else {
        console.error(
          "Unexpected status error occured during adding user: ",
          res.status,
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.log(
          "Unexpected server error occured during adding user: ",
          error,
        );
      }
    } finally {
      setLoadingStore(false);
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
          "Unexpected status error occured during load roles: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occured during loading roles: ",
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
        <form onSubmit={handleStoreUSer} className="space-y-6">
          <div className="border-b border-[#c9a84c]/20 pb-4">
            <h1 className="text-2xl font-semibold text-white">Add User Form</h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter the new user information to add a user account.
            </p>
            <div className="mb-4">
              <UploadInput
                label="Profile Picture"
                name="add_user_profile_picture"
                value={addUserProfilePicture}
                onChange={setAddUserProfilePicture}
                errors={errors.add_user_profile_picture}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b border-[#c9a84c]/20 pb-4">
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
                  {" "}
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
              <div className="mb-4">
                <FloatingLabelInput
                  label="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  errors={errors.password}
                />
              </div>
              <div className="mb-4">
                <FloatingLabelInput
                  label="Password Confirmation"
                  type="password"
                  name="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  errors={errors.password_confirmation}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-[#c9a84c]/20 pt-4">
            {!loadingStore && <CloseButton label="Close" onClose={onClose} />}
            <SubmitButton
              label="Save User"
              loading={loadingStore}
              loadingLabel="Saving User..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddUserFormModal;
