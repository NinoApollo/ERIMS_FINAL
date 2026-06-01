import type { FC } from "react";
import { Link } from "react-router-dom";

interface BackButtonProps {
  label: string;
  path: string;
  newClassName?: string;
  className?: string;
}

const BackButton: FC<BackButtonProps> = ({
  label,
  path,
  newClassName,
  className,
}) => {
  return (
    <>
      <Link
        to={path}
        className={`${newClassName ? newClassName : `px-4 py-3 bg-[#1C2B5E] hover:bg-[#243470] text-[#c9a84c] hover:text-[#d4b563] text-sm font-medium cursor-pointer rounded-lg shadow-lg border border-[#c9a84c]/20 hover:border-[#c9a84c]/50 transition-all duration-200 ${className}`}`}
      >
        {label}
      </Link>
    </>
  );
};

export default BackButton;
