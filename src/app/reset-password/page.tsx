'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ResetPassword() {
  const [step, setStep] = useState<'code' | 'password'>('code');
  const [formData, setFormData] = useState({
    code: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'code') {
      setStep('password');
    } else {
      console.log('Reset password:', formData);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            {step === 'code' ? 'Введите код' : 'Новый пароль'}
          </h1>
          <p className="text-center text-gray-600 mb-8">
            {step === 'code'
              ? 'Мы отправили код подтверждения'
              : 'Придумайте новый надёжный пароль'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'code' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Код подтверждения
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {step === 'code' ? 'Подтвердить' : 'Сохранить пароль'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            <Link href="/login" className="text-blue-600 hover:text-blue-700">
              Вернуться к входу
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
} 