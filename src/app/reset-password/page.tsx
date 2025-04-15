'use client';

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: '',
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState<{
    type: 'error' | 'success' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Пароли не совпадают',
      });
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: formData.code,
          password: formData.password,
          email: searchParams?.get('email') || undefined,
          phone: searchParams?.get('phone') || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Что-то пошло не так');
      }

      setStatus({
        type: 'success',
        message: 'Пароль успешно изменен',
      });

      // Редирект на страницу входа через 2 секунды
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Произошла ошибка',
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Сброс пароля
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Введите код, который мы отправили вам, и новый пароль
          </p>

          {status.type && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Код подтверждения
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Введите код"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Новый пароль
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Минимум 8 символов"
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите пароль
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Повторите пароль"
                minLength={8}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Сменить пароль
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Вспомнили пароль?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-20 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}