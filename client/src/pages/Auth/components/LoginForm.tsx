import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { LoginCredentialsErrorFields } from "../../../interfaces/AuthInterface";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  message: (message: string, isFailed: boolean) => void;
}

const LoginForm: FC<LoginFormProps> = ({ message }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginCredentialsErrorFields>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      await login(username, password);
      navigate("/dashboard");
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setErrors({});
        message(error.response.data.message, true);
      } else if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occured during logging user in: ",
          error,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <FloatingLabelInput
            label="Username"
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            errors={errors.username}
          />
        </div>
        <div className="mb-6">
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
        <SubmitButton
          className="w-full bg-[#c9a84c] hover:bg-[#b8963e] text-[#1C2B5E] font-semibold text-center shadow-lg shadow-[#c9a84c]/20 border border-[#c9a84c]/40 transition-all duration-200"
          label="Sign In"
          loading={isLoading}
          loadingLabel="Signing In..."
        />
      </form>
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          © 2024 FCU-CHTM. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default LoginForm;
