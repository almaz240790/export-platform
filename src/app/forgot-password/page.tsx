'use client';

import { useState } from 'react';
import Link from 'next/link';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ForgotPassword = () => {
  const [resetType, setResetType] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });
  const [status, setStatus] = useState<{
    type: 'error' | 'success' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetType === 'email' ? formData.email : undefined,
          phone: resetType === 'phone' ? formData.phone : undefined,
        }),
      });

      setStatus({
        type: 'success',
        message: 'Инструкции по восстановлению пароля отправлены',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Произошла ошибка при отправке запроса',
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Восстановление пароля
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Укажите email или телефон для восстановления доступа
          </p>

          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setResetType('email')}
              className={`flex-1 py-2 px-4 rounded-lg text-center ${
                resetType === 'email'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setResetType('phone')}
              className={`flex-1 py-2 px-4 rounded-lg text-center ${
                resetType === 'phone'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Телефон
            </button>
          </div>

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
            {resetType === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <PhoneInput
                  country={'ru'}
                  preferredCountries={['ru', 'kz', 'by', 'uz', 'kg']}
                  enableSearch={true}
                  searchPlaceholder="Поиск страны..."
                  inputClass="!w-full !px-4 !py-2 !text-base"
                  containerClass="!w-full"
                  buttonClass="!border-gray-300 !bg-white"
                  searchClass="!w-full !px-4 !py-2 !border !border-gray-300 !rounded-lg"
                  dropdownClass="!w-full !max-h-60 !overflow-y-auto"
                  value={formData.phone}
                  onChange={(phone) => setFormData({ ...formData, phone })}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Отправить код
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
};

export default ForgotPassword; 