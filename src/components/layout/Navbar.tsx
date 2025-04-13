"use client";

import Link from 'next/link';
import { Logo } from '../ui/Logo';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Временные данные для демонстрации
const registeredCompanies = [
  {
    id: 1,
    name: "Korea Auto Export",
    country: "Южная Корея",
    rating: 4.8
  },
  {
    id: 2,
    name: "Japan Cars Direct",
    country: "Япония",
    rating: 4.9
  },
  {
    id: 3,
    name: "Dubai Auto Trading",
    country: "ОАЭ",
    rating: 4.7
  }
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-lg z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-blue-600 text-xl font-bold">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button
                onClick={() => toggleDropdown('companies')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-900"
              >
                Авто экспортные компании
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeDropdown === 'companies' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'companies' && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2">
                  {registeredCompanies.map((company) => (
                    <Link
                      key={company.id}
                      href={`/companies/${company.id}`}
                      className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{company.name}</div>
                      <div className="text-sm text-gray-500">{company.country}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="text-gray-900 hover:text-gray-600 transition-colors">
              О нас
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-blue-600 hover:text-blue-700 transition-colors">
                Войти
              </Link>
              <Link 
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Регистрация
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <Link href="/about" className="block py-2 text-gray-600 hover:text-gray-900">
              О нас
            </Link>
            <button
              onClick={() => toggleDropdown('mobile-catalog')}
              className="w-full text-left py-2 text-gray-600 hover:text-gray-900 flex items-center justify-between"
            >
              <span>Каталог</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            {activeDropdown === 'mobile-catalog' && (
              <div className="pl-4">
                <Link href="/catalog" className="block py-2 text-gray-600 hover:text-gray-900">
                  Все автомобили
                </Link>
                <Link href="/catalog/new" className="block py-2 text-gray-600 hover:text-gray-900">
                  Новые поступления
                </Link>
              </div>
            )}
            <button
              onClick={() => toggleDropdown('mobile-suppliers')}
              className="w-full text-left py-2 text-gray-600 hover:text-gray-900 flex items-center justify-between"
            >
              <span>Поставщики</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            {activeDropdown === 'mobile-suppliers' && (
              <div className="pl-4">
                <Link href="/suppliers" className="block py-2 text-gray-600 hover:text-gray-900">
                  Все поставщики
                </Link>
                <Link href="/suppliers/register" className="block py-2 text-gray-600 hover:text-gray-900">
                  Стать поставщиком
                </Link>
              </div>
            )}
            <Link href="/login" className="block py-2 text-blue-600 hover:text-blue-700">
              Войти
            </Link>
            <Link href="/register" className="block py-2 text-blue-600 hover:text-blue-700">
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}; 