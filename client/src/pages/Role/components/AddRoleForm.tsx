import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";

const AddRole = () => {
  return (
    <>
      <form>
        <div className="mb-4">
          <FloatingLabelInput label="Role" type="text" name="gender" />
        </div>
        <div className="flex justify-end">
          <SubmitButton label="Save Role" />
        </div>
      </form>
    </>
  );
};

export default AddRole;
