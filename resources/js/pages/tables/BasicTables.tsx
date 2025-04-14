import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/BasicTables/BasicTableOne";

// Định nghĩa kiểu dữ liệu cho user
interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
  image: string | null;
}

interface BasicTablesProps {
  users: User[];
}

export default function BasicTables({ users }: BasicTablesProps) {
  return (
    <div className="space-y-6">
      <ComponentCard title="Quản lý người dùng">
        <BasicTableOne users={users} />
      </ComponentCard>
    </div>
  );
}
