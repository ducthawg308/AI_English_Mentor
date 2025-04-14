import { useState } from "react";
import { useModal } from "../../hooks/useModal";
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { Pencil, Trash2, Plus } from 'lucide-react';
import ModalEditUser from "../ui/modal/ModalEditUser";
import ModalConfirmDelete from "../ui/modal/ModalConfirmDelete";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  image: string | null;
  email_verified_at: string | null;
}

interface BasicTableOneProps {
  users: User[];
}

export default function BasicTableOne({ users: initialUsers }: BasicTableOneProps) {
  const { isOpen: isEditOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const { isOpen: isCreateOpen, openModal: openCreateModal, closeModal: closeCreateModal } = useModal();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userList, setUserList] = useState<User[]>(initialUsers);

  const handleSave = async (userData: Partial<User>, isNew: boolean = false) => {
    try {
      if (isNew) {
        const response = await axios.post('/admin/users', userData);
        setUserList([...userList, response.data.user]);
        closeCreateModal();
      } else if (selectedUserId) {
        const response = await axios.put(`/admin/users/${selectedUserId}`, userData);
        setUserList(userList.map(u => u.id === selectedUserId ? response.data.user : u));
        closeEditModal();
      }
    } catch (error: any) {
      console.error("Error saving user:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async () => {
    try {
      if (selectedUserId) {
        await axios.delete(`/admin/users/${selectedUserId}`);
        setUserList(userList.filter(u => u.id !== selectedUserId));
        closeDeleteModal();
        setSelectedUserId(null);
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleOpenDeleteModal = (userId: number) => {
    setSelectedUserId(userId);
    openDeleteModal();
  };

  const handleOpenEditModal = (userId: number) => {
    setSelectedUserId(userId);
    openEditModal();
  };

  return (
    <>
      <div className="flex justify-start">
        <Button
          size="sm"
          variant="outline"
          startIcon={<Plus className="size-4" />}
          onClick={openCreateModal}
        >
          Thêm người dùng
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">STT</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Người dùng</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Email</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Trạng thái</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Thao tác</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {userList.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-700 text-theme-sm dark:text-gray-300">
                    {index + 1}
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
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={user.email_verified_at ? "success" : "error"}
                    >
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
              ))}
            </TableBody>
          </Table>
        </div>

        <ModalEditUser
          isOpen={isEditOpen}
          onClose={closeEditModal}
          onSave={(data) => handleSave(data, false)}
          user={userList.find(u => u.id === selectedUserId) || null}
        />

        <ModalEditUser
          isOpen={isCreateOpen}
          onClose={closeCreateModal}
          onSave={(data) => handleSave(data, true)}
          user={null}
        />

        <ModalConfirmDelete
          isOpen={isDeleteOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      </div>
    </>
  );
}