"use client";

import { Navbar } from '@/components/layout/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-8">
          Добро пожаловать на <span className="text-blue-600">Export Platform</span>
        </h1>
        <p className="text-2xl mb-4">
          Платформа для экспортеров и бизнеса
        </p>
        <p className="text-lg mb-8">
          Найдите надежных партнеров для экспорта товаров и услуг
        </p>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="/login"
            className="p-6 mt-6 text-center bg-blue-600 rounded-lg text-white w-96 hover:bg-blue-700 transition-colors"
          >
            <h3 className="text-2xl font-bold">Войти &rarr;</h3>
            <p className="mt-4 text-xl">
              Авторизуйтесь для доступа к платформе
            </p>
          </a>

          <a
            href="/register"
            className="p-6 mt-6 text-center border border-gray-300 rounded-lg hover:border-blue-600 w-96 transition-colors"
          >
            <h3 className="text-2xl font-bold">Регистрация &rarr;</h3>
            <p className="mt-4 text-xl">
              Создайте новый аккаунт на платформе
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t mt-8">
        <p className="text-gray-600">
          Export Platform &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
} 