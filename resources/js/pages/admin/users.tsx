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

export default function Users() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
               <BasicTables />
            </div>
        </AppLayout>
    );
}
