import ComponentCard from "@/components/common/ComponentCard";
import BasicTableUsers from "@/components/tables/users/BasicTableUsers";

// Định nghĩa kiểu dữ liệu cho user
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  image: string | null;
  email_verified_at: string | null;
}

interface BasicTablesProps {
  users: User[];
}

export default function BasicTables({ users }: BasicTablesProps) {
  return (
    <div className="space-y-6">
      <ComponentCard title="Quản lý người dùng">
        <BasicTableUsers users={users} />
      </ComponentCard>
    </div>
  );
}
