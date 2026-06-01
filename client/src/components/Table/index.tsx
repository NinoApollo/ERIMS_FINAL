import type { FC, ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  colSpan?: number;
  isHeader?: boolean;
  className?: string;
}

const Table: FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full ${className}`}>{children}</table>;
};

const TableHeader: FC<TableHeaderProps> = ({ children, className }) => {
  return (
    <thead className={`bg-[#0E1A3A] border-b border-[#c9a84c]/20 ${className}`}>
      {children}
    </thead>
  );
};

const TableBody: FC<TableBodyProps> = ({ children, className }) => {
  return (
    <tbody className={`divide-y divide-[#c9a84c]/10 ${className}`}>
      {children}
    </tbody>
  );
};

const TableRow: FC<TableRowProps> = ({ children, className }) => {
  return (
    <tr
      className={`transition-colors duration-150 hover:bg-[#c9a84c]/5 ${className}`}
    >
      {children}
    </tr>
  );
};

const TableCell: FC<TableCellProps> = ({
  children,
  colSpan,
  isHeader,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  const baseStyles = isHeader
    ? `px-4 py-3 text-left text-xs font-semibold tracking-wider text-[#c9a84c]/70 uppercase ${className}`
    : `px-4 py-3 text-sm text-slate-300 ${className}`;

  return (
    <CellTag colSpan={colSpan} className={baseStyles}>
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
