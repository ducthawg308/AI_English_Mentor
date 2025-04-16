"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useModal } from "../../hooks/useModal"
import axios from "axios"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"
import Badge from "../ui/badge/Badge"
import Button from "../ui/button/Button"
import { Pencil, Trash2, Plus } from "lucide-react"
import ModalEditUser from "../ui/modal/ModalEditUser"
import ModalConfirmDelete from "../ui/modal/ModalConfirmDelete"

interface User {
  id: number
  name: string
  email: string
  role: string
  image: string | null
  email_verified_at: string | null
}

interface BasicTableOneProps {
  users: User[]
}

export default function BasicTableOne({ users: initialUsers }: BasicTableOneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal()
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal()
  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [userList, setUserList] = useState<User[]>(initialUsers)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(5) // Đã giảm xuống 5 để dễ kiểm tra phân trang
  const [totalPages, setTotalPages] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers)

  // Lọc người dùng dựa trên từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(userList)
    } else {
      const lowercasedSearch = searchTerm.toLowerCase()
      const filtered = userList.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercasedSearch) ||
          user.email.toLowerCase().includes(lowercasedSearch) ||
          user.role.toLowerCase().includes(lowercasedSearch),
      )
      setFilteredUsers(filtered)
    }
    // Reset về trang 1 khi tìm kiếm
    setCurrentPage(1)
  }, [searchTerm, userList])

  // Tính toán số trang dựa trên danh sách đã lọc
  useEffect(() => {
    setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage))
    // Nếu trang hiện tại lớn hơn tổng số trang, reset về trang 1
    if (currentPage > Math.ceil(filteredUsers.length / itemsPerPage) && filteredUsers.length > 0) {
      setCurrentPage(1)
    }
  }, [filteredUsers, itemsPerPage, currentPage])

  // Lấy danh sách người dùng cho trang hiện tại
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSave = async (userData: Partial<User>) => {
    try {
      const formData = new FormData()

      // Thêm các trường thông tin cơ bản
      if (userData.name) formData.append("name", userData.name)
      if (userData.email) formData.append("email", userData.email)
      if (userData.role) formData.append("role", userData.role)
      if (userData.email_verified_at !== undefined) {
        formData.append("email_verified_at", userData.email_verified_at ? userData.email_verified_at : "")
      }
      if (userData.password) formData.append("password", userData.password)
      if (userData.password_confirmation) formData.append("password_confirmation", userData.password_confirmation)

      // Thêm file avatar nếu có
      if ("avatar_file" in userData && userData.avatar_file instanceof File) {
        formData.append("avatar", userData.avatar_file)
      }

      // Xác định đây là tạo mới hay cập nhật
      const isNew = !selectedUserId

      if (isNew) {
        const response = await axios.post("/admin/users", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        setUserList([...userList, response.data.user])
        closeCreateModal()
      } else if (selectedUserId) {
        const response = await axios.post(`/admin/users/${selectedUserId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-HTTP-Method-Override": "PUT", // Cho Laravel để xử lý như PUT request
          },
        })
        setUserList(userList.map((u) => (u.id === selectedUserId ? response.data.user : u)))
        closeEditModal()
      }
    } catch (error: any) {
      console.error("Error saving user:", error)
      alert(error.response?.data?.message || "Có lỗi xảy ra")
    }
  }

  const handleDelete = async () => {
    try {
      if (selectedUserId) {
        await axios.delete(`/admin/users/${selectedUserId}`)
        setUserList(userList.filter((u) => u.id !== selectedUserId))
        closeDeleteModal()
        setSelectedUserId(null)
      }
    } catch (error: any) {
      console.error("Error deleting user:", error)
      alert(error.response?.data?.message || "Có lỗi xảy ra")
    }
  }

  const handleOpenDeleteModal = (userId: number) => {
    setSelectedUserId(userId)
    openDeleteModal()
  }

  const handleOpenEditModal = (userId: number) => {
    setSelectedUserId(userId)
    openEditModal()
  }

  // Xử lý sự kiện tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputRef.current) {
      setSearchTerm(inputRef.current.value)
    }
  }

  // Xử lý sự kiện thay đổi input tìm kiếm
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        {/* Nút "Thêm người dùng" - Bên trái */}
        <div>
          <Button size="sm" variant="outline" startIcon={<Plus className="size-4" />} onClick={openCreateModal}>
            Thêm người dùng
          </Button>
        </div>

        {/* Ô tìm kiếm - Bên phải, chỉ hiển thị trên lg trở lên */}
        <div className="hidden lg:block">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                    fill=""
                  />
                </svg>
              </span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Nhập từ khóa tìm kiếm..."
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                value={searchTerm}
                onChange={handleSearchInputChange}
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
              >
                <span> Tìm kiếm </span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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

        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                  </span>{" "}
                  đến <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span>{" "}
                  của <span className="font-medium">{filteredUsers.length}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-700 dark:hover:bg-gray-800"
                  >
                    <span className="sr-only">Trước</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed dark:ring-gray-700 dark:hover:bg-gray-800"
                  >
                    <span className="sr-only">Sau</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        <ModalEditUser
          isOpen={isEditOpen}
          onClose={closeEditModal}
          onSave={handleSave}
          user={userList.find((u) => u.id === selectedUserId) || null}
        />

        <ModalEditUser isOpen={isCreateOpen} onClose={closeCreateModal} onSave={handleSave} user={null} />

        <ModalConfirmDelete isOpen={isDeleteOpen} onClose={closeDeleteModal} onConfirm={handleDelete} />
      </div>
    </>
  )
}
