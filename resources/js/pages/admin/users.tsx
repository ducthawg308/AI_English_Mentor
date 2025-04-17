import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import BasicTables from '../../components/tables/BasicTables';
import BasicTableUsers from '@/components/tables/users/BasicTableUsers';

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
        email_verified_at: string | null; 
        status: string;
        role: string;
        avatar: string | null;
    }>;
}

export default function Users({ users }: UsersProps) {
    console.log('Dữ liệu từ backend:', users);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quản lý người dùng" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <BasicTableUsers users={users} />
            </div>
        </AppLayout>
    );
}