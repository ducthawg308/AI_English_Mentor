import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import BasicTables from '../tables/BasicTables';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Quản lý người dùng',
        href: '/dashboard',
    },
];

interface UsersProps {
    users: Array<{
        id: number;
        name: string;
        email: string;
        status: string;
        role: string;
        image: string | null;
    }>;
}

export default function Users({ users }: UsersProps) {
    // Kiểm tra xem dữ liệu người dùng có hợp lệ không
    if (!users || !Array.isArray(users) || users.length === 0) {
        return <div>Không có dữ liệu người dùng</div>;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <BasicTables users={users} />
            </div>
        </AppLayout>
    );
}