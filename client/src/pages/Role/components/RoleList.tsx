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
                className="text-green-600 hover:underline font-medium"
              >
                Edit
              </Link>
            </div>
            <div>
              <Link
                to="/roles/delete"
                className="text-red-600 hover:underline font-medium"
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
                className="text-green-600 hover:underline font-medium"
              >
                Edit
              </Link>
            </div>
            <div>
              <Link
                to="/roles/delete"
                className="text-red-600 hover:underline font-medium"
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
                className="text-green-600 hover:underline font-medium"
              >
                Edit
              </Link>
            </div>
            <div>
              <Link
                to="/roles/delete"
                className="text-red-600 hover:underline font-medium"
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
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="max-w-full max-h-[calc(100vh)] overflow-auto">
          <Table>
            <TableHeader className="border-b border-gray-200 bg-blue-600 sticky top-0 text-white text-xs">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
              {roles.map((role, index) => (
                <TableRow className="hover:bg-gray-100" key={index}>
                  <TableCell className="px-4 py-3 text-center">
                    {role.role_id}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-start">
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
