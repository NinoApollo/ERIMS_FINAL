import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";

const DeleteRoleForm = () => {
  return (
    <>
      <form>
        <div className="mb-4">
          <FloatingLabelInput label="Role" type="text" name="role" />
        </div>
        <div className="flex justify-end gap-2">
          <BackButton label="Back" path="/" />
          <SubmitButton
            label="Delete Role"
            className="bg-red-600 hover:bg-red-700"
          />
        </div>
      </form>
    </>
  );
};

export default DeleteRoleForm;
