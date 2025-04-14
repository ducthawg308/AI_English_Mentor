import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { Pencil, Trash2 } from 'lucide-react';

<<<<<<< HEAD
interface Users {
=======
interface User {
>>>>>>> f7c226f (ql nguoi dung v2)
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
  image: string | null;
}

<<<<<<< HEAD
// Define the table data using the interface
const tableData: Users[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Admin",
    },
    email: "ducthangofficial@gmail.com",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-14.jpg",
      name: "Lindsey Curtis",
      role: "User",
    },
    email: "nguyenduchoanhtx@gmail.com",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-12.jpg",
      name: "Lindsey Curtis",
      role: "User",
    },
    email: "ducthangofficial@gmail.com",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-11.jpg",
      name: "Lindsey Curtis",
      role: "User",
    },
    email: "ducthangofficial@gmail.com",
    status: "Active",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-10.jpg",
      name: "Lindsey Curtis",
      role: "User",
    },
    email: "ducthangofficial@gmail.com",
    status: "Active",
  },
];
=======
interface BasicTableOneProps {
  users: User[];
}
>>>>>>> f7c226f (ql nguoi dung v2)

export default function BasicTableOne({ users }: BasicTableOneProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">STT</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Người dùng</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Email</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Trạng thái</TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Thao tác</TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
<<<<<<< HEAD
            {tableData.map((user, index) => (
=======
            {users.map((user, index) => (
>>>>>>> f7c226f (ql nguoi dung v2)
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
<<<<<<< HEAD
                        src={user.user.image}
                        alt={user.user.name}
=======
                        src={user.image ?? "/images/user/default.jpg"} // fallback nếu image null
                        alt={user.name}
>>>>>>> f7c226f (ql nguoi dung v2)
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
<<<<<<< HEAD
                        {user.user.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {user.user.role}
=======
                        {user.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {user.role}
>>>>>>> f7c226f (ql nguoi dung v2)
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
                    color={
                      user.status === "Active"
                        ? "success"
                        : user.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div className="flex items-center gap-2">
                    <button title="Sửa" className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button title="Xoá" className="text-red-600 hover:text-red-800 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
