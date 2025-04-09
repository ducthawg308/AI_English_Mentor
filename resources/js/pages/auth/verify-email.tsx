// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Xác minh email" description="Vui lòng xác minh địa chỉ email của bạn bằng cách nhấp vào liên kết mà chúng tôi vừa gửi qua email cho bạn.">
            <Head title="Xác minh Email" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Một liên kết xác minh mới đã được gửi đến địa chỉ email mà bạn cung cấp khi đăng ký.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Gửi lại liên kết
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                    Đăng xuất
                </TextLink>
            </form>
        </AuthLayout>
    );
}
