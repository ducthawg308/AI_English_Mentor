"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table"
import Badge from "../../ui/badge/Badge"
import { Pencil, Trash2 } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  image: string | null
  email_verified_at: string | null
}

interface UserTableProps {
  paginatedUsers: User[]
  currentPage: number
  itemsPerPage: number
  searchTerm: string
  handleOpenEditModal: (userId: number) => void
  handleOpenDeleteModal: (userId: number) => void
}

export default function UserTable({
  paginatedUsers,
  currentPage,
  itemsPerPage,
  searchTerm,
  handleOpenEditModal,
  handleOpenDeleteModal,
}: UserTableProps) {
  return (
    <div className="max-w-full overflow-x-auto">
      <Table>
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              STT
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Người dùng
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Email
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Trạng thái
            </TableCell>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Thao tác
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-700 text-theme-sm dark:text-gray-300">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={
                          user.image
                            ? user.image
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`
                        }
                        alt={user.name}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{user.role}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge size="sm" color={user.email_verified_at ? "success" : "error"}>
                    {user.email_verified_at ? "Đã kích hoạt" : "Chưa kích hoạt"}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(user.id)}
                      title="Sửa"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(user.id)}
                      title="Xoá"
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="px-4 py-8 text-center text-gray-500">
                Không tìm thấy người dùng nào phù hợp với từ khóa "{searchTerm}"
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}