import ClientPage from '@/components/ClientPage';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function ResetPassword() {
  return (
    <ClientPage>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 py-20 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </ClientPage>
  );
}