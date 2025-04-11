import ComponentCard from "@/components/common/ComponentCard";
import BasicTableOne from "@/components/BasicTables/BasicTableOne";

export default function BasicTables() {
  return (
    <>
      <div className="space-y-6">
        <ComponentCard title="Quản lý người dùng">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}