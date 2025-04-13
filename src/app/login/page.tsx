'use client';

import { useState } from 'react';
import Link from 'next/link';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function Login() {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Вход в систему
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Войдите для доступа к платформе
          </p>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setLoginType('email')}
              className={`flex-1 py-2 px-4 rounded-lg text-center ${
                loginType === 'email'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginType('phone')}
              className={`flex-1 py-2 px-4 rounded-lg text-center ${
                loginType === 'phone'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Телефон
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {loginType === 'email' ? (
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-600">Запомнить меня</span>
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700">
                Забыли пароль?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Войти
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
} 