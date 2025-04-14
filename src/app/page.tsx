"use client";

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-12 sm:px-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6 sm:mb-8">
          Добро пожаловать на <span className="text-blue-600">Export Platform</span>
        </h1>
        <p className="text-xl sm:text-2xl mb-4">
          Платформа для экспортеров и бизнеса
        </p>
        <p className="text-base sm:text-lg mb-8">
          Найдите надежных партнеров для экспорта товаров и услуг
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 max-w-4xl mt-6 w-full">
          <Link
            href="/login"
            className="p-6 text-center bg-blue-600 rounded-lg text-white w-full sm:w-1/2 hover:bg-blue-700 transition-colors"
          >
            <h3 className="text-2xl font-bold">Войти &rarr;</h3>
            <p className="mt-4 text-xl">
              Авторизуйтесь для доступа к платформе
            </p>
          </Link>

          <Link
            href="/register"
            className="p-6 text-center border border-gray-300 rounded-lg hover:border-blue-600 w-full sm:w-1/2 transition-colors"
          >
            <h3 className="text-2xl font-bold">Регистрация &rarr;</h3>
            <p className="mt-4 text-xl">
              Создайте новый аккаунт на платформе
            </p>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
} 