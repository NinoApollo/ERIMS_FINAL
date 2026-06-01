import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import UserService from "../../../services/UserService";
import Spinner from "../../../components/Spinner/Spinner";
import type { UserColumns } from "../../../interfaces/UserInterface";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";

interface UserListProps {
  onAddUser: () => void;
  onEditUser: (user: UserColumns | null) => void;
  onDeleteUser: (user: UserColumns | null) => void;
  refreshKey: boolean;
}

const UserList: FC<UserListProps> = ({
  onAddUser,
  onEditUser,
  onDeleteUser,
  refreshKey,
}) => {
  useEffect(() => {
    document.title = "User List Page";
  }, []);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<UserColumns[]>([]);
  const [usersTableCurrentPage, setUsersTableCurrentPage] = useState(1);
  const [usersTableLastPage, setUsersTableLastPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const tableRef = useRef<HTMLDivElement>(null);

  const handleLoadUsers = async (
    page: number,
    append = false,
    search: string,
  ) => {
    try {
      setLoadingUsers(true);

      const res = await UserService.loadUsers(page, search);

      if (res.status === 200) {
        const usersData = res.data.users.data || res.data.users || [];
        const lastPage =
          res.data.users.last_page ||
          res.data.last_page ||
          usersTableLastPage ||
          1;

        setUsers(append ? [...users, ...usersData] : usersData);
        setUsersTableCurrentPage(page);
        setUsersTableLastPage(lastPage);
        setHasMore(page < lastPage);
      } else {
        setUsers(append ? users : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading users: ",
        error,
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;

    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 &&
      hasMore &&
      !loadingUsers
    ) {
      handleLoadUsers(usersTableCurrentPage + 1, true, debouncedSearch);
    }
  }, [hasMore, loadingUsers, usersTableCurrentPage]);

  const handleUserFullNameFormat = (user: UserColumns) => {
    let fullName = "";

    if (user.middle_name) {
      fullName = `${user.last_name}, ${user.first_name} ${user.middle_name.charAt(0)}.`;
    } else {
      fullName = `${user.last_name}, ${user.first_name}`;
    }

    if (user.suffix_name) {
      fullName += ` ${user.suffix_name}`;
    }

    return fullName;
  };

  useEffect(() => {
    const ref = tableRef.current;

    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref) {
        ref.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 800);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setUsers([]);
    setUsersTableCurrentPage(1);
    setHasMore(true);

    handleLoadUsers(usersTableCurrentPage, false, debouncedSearch);
  }, [refreshKey, debouncedSearch]);

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-[#c9a84c]/20 bg-[#1C2B5E] shadow-2xl">
        <div
          ref={tableRef}
          className="relative max-w-full max-h-[calc(100vh-8.5rem)] overflow-x-auto [-ms-overflow-style:none]"
        >
          <Table>
            <caption className=" mb-4 ">
              <div className="p-4 flex justify-between border-b border-[#c9a84c]/20 bg-[#1C2B5E]">
                <div className="w-64">
                  <FloatingLabelInput
                    label="Search"
                    type="text"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#c9a84c] hover:bg-[#b8963e] text-[#1C2B5E] font-semibold rounded-lg shadow-lg shadow-[#c9a84c]/20 border border-[#c9a84c]/40 transition cursor-pointer text-sm tracking-wide"
                  onClick={onAddUser}
                >
                  Add User
                </button>
              </div>
            </caption>
            <TableHeader className="border-b border-[#c9a84c]/30 bg-[#6B1E3C] sticky top-0 text-[#c9a84c] text-xs z-10 uppercase tracking-widest">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  colSpan={2}
                  className="px-5 py-3 font-medium text-start"
                >
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Birth Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Age
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/6 text-slate-300 text-sm bg-[#1C2B5E]">
              {(users.length ?? 0 > 0) ? (
                users.map((user, index) => (
                  <TableRow
                    className="hover:bg-[#6B1E3C]/20 transition-colors duration-150"
                    key={index}
                  >
                    <TableCell className="px-4 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-3 items-end justify-end">
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={handleUserFullNameFormat(user)}
                          className="object-cover w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="relative inline-flex items-center justify-center w-10 h-10 text-center text-sm overflow-hidden bg-[#c9a84c]/15 border border-[#c9a84c]/30 rounded-full">
                          <span className="font-semibold text-[#c9a84c]">
                            {`${user.last_name.charAt(0)}${user.first_name.charAt(0)}`}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {handleUserFullNameFormat(user)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.role.role}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.birth_date}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {user.age}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="text-[#c9a84c] font-medium cursor-pointer hover:text-[#e8c96a] hover:underline transition-colors"
                          onClick={() => onEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-400 font-medium cursor-pointer hover:text-red-300 hover:underline transition-colors"
                          onClick={() => onDeleteUser(user)}
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : !loadingUsers && (users.length ?? 0) <= 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-4 py-8 text-center font-medium text-slate-500"
                  >
                    No Records Found
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
              {loadingUsers && (users.length ?? 0) > 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="px-4 py-3 text-center">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default UserList;
