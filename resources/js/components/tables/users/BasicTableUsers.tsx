"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useModal } from "../../../hooks/useModal"
import axios from "axios"
import Button from "../../ui/button/Button"
import { Plus } from "lucide-react"
import ModalEditUser from "../../ui/modal/ModalEditUser"
import ModalConfirmDelete from "../../ui/modal/ModalConfirmDelete"
import SearchBar from "../shared/SearchBar"
import Pagination from "../shared/Pagination"
import UserTable from "./UserTable"

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar: string | null
  email_verified_at: string | null
}

interface BasicTableUsersProps {
  users: User[]
}

export default function BasicTableUsers({ users: initialUsers }: BasicTableUsersProps) {
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal()
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal()
  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [userList, setUserList] = useState<User[]>(initialUsers)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage] = useState<number>(5)
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
    setCurrentPage(1)
  }, [searchTerm, userList])

  // Tính toán số trang dựa trên danh sách đã lọc
  useEffect(() => {
    setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage))
    if (currentPage > Math.ceil(filteredUsers.length / itemsPerPage) && filteredUsers.length > 0) {
      setCurrentPage(1)
    }
  }, [filteredUsers, itemsPerPage, currentPage])

  // Lấy danh sách người dùng cho trang hiện tại
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSave = async (userData: Partial<User>) => {
    try {
      const formData = new FormData()
      if (userData.name) formData.append("name", userData.name)
      if (userData.email) formData.append("email", userData.email)
      if (userData.role) formData.append("role", userData.role)
      if (userData.email_verified_at !== undefined) {
        formData.append("email_verified_at", userData.email_verified_at ? userData.email_verified_at : "")
      }
      if (userData.password) formData.append("password", userData.password)
      if (userData.password_confirmation) formData.append("password_confirmation", userData.password_confirmation)
      if ("avatar_file" in userData && userData.avatar_file instanceof File) {
        formData.append("avatar", userData.avatar_file)
      }

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
            "X-HTTP-Method-Override": "PUT",
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(searchTerm)
  }

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button size="sm" variant="outline" startIcon={<Plus className="size-4" />} onClick={openCreateModal}>
            Thêm người dùng
          </Button>
        </div>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchInputChange}
          onSearchSubmit={handleSearch}
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <UserTable
          paginatedUsers={paginatedUsers}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          searchTerm={searchTerm}
          handleOpenEditModal={handleOpenEditModal}
          handleOpenDeleteModal={handleOpenDeleteModal}
        />

        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ModalEditUser
        isOpen={isEditOpen}
        onClose={closeEditModal}
        onSave={handleSave}
        user={userList.find((u) => u.id === selectedUserId) || null}
      />

      <ModalEditUser isOpen={isCreateOpen} onClose={closeCreateModal} onSave={handleSave} user={null} />

      <ModalConfirmDelete isOpen={isDeleteOpen} onClose={closeDeleteModal} onConfirm={handleDelete} />
    </>
  )
}