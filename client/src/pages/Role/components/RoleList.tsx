import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";

const RoleList = () => {
  const roles = [
    {
      role_id: 1,
      role: "Admin",
      action: (
        <>
          <div className="flex gap-4">
            <div>
              <Link
                to="/roles/edit"
                className="text-emerald-600 hover:underline hover:text-emerald-700 font-medium transition-colors"
              >
                Edit
              </Link>
            </div>
            <div>
              <Link
                to="/roles/delete"
                className="text-rose-600 hover:underline hover:text-rose-700 font-medium transition-colors"
              >
                Delete
              </Link>
            </div>
          </div>
        </>
      ),
    },
    {
      role_id: 2,
      role: "Faculty",
      action: (
        <>
          <div className="flex gap-4">
            <div>
              <Link
                to="/roles/edit"
                className="text-emerald-600 hover:underline hover:text-emerald-700 font-medium transition-colors"
              >
                Edit
              </Link>
            </div>
            <div>
              <Link
                to="/roles/delete"
                className="text-rose-600 hover:underline hover:text-rose-700 font-medium transition-colors"
              >
                Delete
              </Link>
            </div>
          </div>
        </>
      ),
    },
    {
      role_id: 3,
      role: "Student",
      action: (
        <>
          <div className="flex gap-4">
            <div>
              <Link
                to="/roles/edit"
                className="text-emerald-600 hover:underline hover:text-emerald-700 font-medium transition-colors"
              >
                Edit
              </Link>
            </div>
            <div>
              <Link
                to="/roles/delete"
                className="text-rose-600 hover:underline hover:text-rose-700 font-medium transition-colors"
              >
                Delete
              </Link>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-emerald-100 bg-white">
        <div className="max-w-full max-h-[calc(100vh)] overflow-auto">
          <Table>
            <TableHeader className="border-b border-emerald-100 bg-linear-to-r from-emerald-600 to-emerald-700 sticky top-0 text-white text-xs">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-center"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-center"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 font-medium text-center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-emerald-50 text-emerald-700 text-sm">
              {roles.map((role, index) => (
                <TableRow className="hover:bg-emerald-50" key={index}>
                  <TableCell className="px-4 py-3 text-center">
                    {role.role_id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {role.role}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    {role.action}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default RoleList;
