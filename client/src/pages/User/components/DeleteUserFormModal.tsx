import { useEffect, useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import UserService from "../../../services/UserService";
import type { UserColumns } from "../../../interfaces/UserInterface";

interface DeleteUserFormModalProps {
  user: UserColumns | null;
  onUserDeleted: (message: string) => void;
  refreshKey: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteUserFormModal: FC<DeleteUserFormModalProps> = ({
  user,
  onUserDeleted,
  refreshKey,
  isOpen,
  onClose,
}) => {
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [role, setRole] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [username, setUsername] = useState("");

  const handleDestroyUser = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingDestroy(true);

      const res = await UserService.destroyUser(user?.user_id!);

      if (res.status === 200) {
        onUserDeleted(res.data.message);
        refreshKey();
        onClose();
      } else {
        console.error(
          "Unexpected status error occurred during deleting user: ",
          res.status,
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting user: ",
        error,
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFirstName(user.first_name);
        setMiddleName(user.middle_name ?? "");
        setLastName(user.last_name);
        setSuffixName(user.suffix_name ?? "");
        setRole(user.role.role);
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
        <form onSubmit={handleDestroyUser}>
          <h1 className="text-2xl border-b border-[#c9a84c]/20 pb-4 font-semibold mb-4 text-white">
            Delete User Form
          </h1>
          <div className="grid grid-cols-2 gap-4 border-b border-[#c9a84c]/20 mb-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <label
                  htmlFor="first_name"
                  className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold mb-1 block"
                >
                  First Name
                </label>
                <p className="text-white font-medium">{firstName}</p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="middle_name"
                  className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold mb-1 block"
                >
                  Middle Name
                </label>
                <p className="text-white font-medium">{middleName || "N/A"}</p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="last_name"
                  className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold mb-1 block"
                >
                  Last Name
                </label>
                <p className="text-white font-medium">{lastName}</p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="suffix_name"
                  className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold mb-1 block"
                >
                  Suffix Name
                </label>
                <p className="text-white font-medium">{suffixName || "N/A"}</p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold mb-1 block"
                >
                  Role
                </label>
                <p className="text-white font-medium">{role}</p>
              </div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <label
                  htmlFor="birth_date"
                  className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold mb-1 block"
                >
                  Birth Date
                </label>
                <p className="text-white font-medium">{birthDate}</p>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="text-[#c9a84c]/70 text-xs uppercase tracking-widest font-semibold mb-1 block"
                >
                  Username
                </label>
                <p className="text-white font-medium">{username}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <CloseButton label="Close" onClose={onClose} />}
            <SubmitButton
              className="bg-red-600 hover:bg-red-700"
              label="Delete User"
              loading={loadingDestroy}
              loadingLabel="Deleting User..."
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DeleteUserFormModal;
