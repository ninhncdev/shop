import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { useState } from "react";
import { useUsers } from "../../../hooks/useUsers";

import { useModal } from "../../../hooks/useModal";
import UserEditModal from "./UserEditModal";
import Button from "../../ui/button/Button";

export default function BasicTableOne() {
  const [selectedUser, setSelectedUser] = useState<
    | {
        id?: number | string;
        name?: string;
        email?: string;
        role?: string;
        is_active?: boolean;
      }
    | undefined
  >(undefined);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // 👈 chọn số lượng user mỗi trang

  const { users, total, refetchUsers } = useUsers(page, limit); // 👈 hook nhận thêm limit
  const { isOpen, openModal, closeModal } = useModal();

  const totalPages = Math.ceil(total / limit); // 👈 tổng số trang

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-white/[0.05]">
        <Button
          onClick={() => {
            setSelectedUser(undefined);
            openModal();
          }}
        >
          + Thêm người dùng
        </Button>

        {/* Chọn số lượng user mỗi trang */}
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="text-sm text-gray-600">
            Hiển thị:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // reset về trang 1 khi đổi limit
            }}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start">
                Tên người dùng
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Quyền
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Trạng thái
              </TableCell>
              <TableCell isHeader className="px-5 py-3 text-start">
                Chức năng
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div>
                    <span className="block font-medium">{user.name}</span>
                    <span className="block text-gray-500 text-sm">
                      {user.role}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  {user.role}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Badge
                    size="sm"
                    color={user.is_active ? "success" : "warning"}
                  >
                    {user.is_active ? "Bật" : "Tắt"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      openModal();
                    }}
                    className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm"
                  >
                    Sửa
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <UserEditModal
        isOpen={isOpen}
        onClose={closeModal}
        user={selectedUser}
        onSave={() => {
          refetchUsers();
        }}
      />
    </div>
  );
}
