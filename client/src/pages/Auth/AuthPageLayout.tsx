import type { FC, ReactNode } from "react";
import ChtmLogo from "../../assets/img/ChtmLogo.png";

interface AuthPageLayoutProps {
  children: ReactNode;
}

const AuthPageLayout: FC<AuthPageLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="min-h-screen flex flex-row bg-[#0E1A3A]">
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-[#0E1A3A]">
          <div className="w-full max-w-md p-8 bg-[#1C2B5E] rounded-xl shadow-2xl border border-[#c9a84c]/20">
            <div className="flex flex-col items-center mb-6">
              <img className="h-16 mb-2" src={ChtmLogo} alt="ChtmLogo" />
              <h2 className="text-2xl font-bold text-[#c9a84c]">
                FCU-CHTM ERIMS
              </h2>
              <p className="text-sm text-slate-400 mt-1 font-medium">
                Equipment & Laboratory Resource Management System
              </p>
            </div>
            {children}
          </div>
        </div>
        <div className="hidden lg:flex w-1/2 h-screen items-center justify-center bg-[#6B1E3C]/20 border-l border-[#c9a84c]/20">
          <div className="text-center p-8">
            <img
              className="object-contain w-64 h-64 mx-auto mb-6 opacity-90"
              src={ChtmLogo}
              alt="Chtmlogo"
            />
            <h3 className="text-2xl font-bold text-white mb-2">
              Welcome Back!
            </h3>
            <p className="text-slate-400">
              Sign in to access the Equipment and Laboratory Resource Management
              System
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPageLayout;
