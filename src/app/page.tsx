"use client";

import { Navbar } from '@/components/layout/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center px-4">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2000&auto=format"
            alt="Hero background"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
        </div>
        
        <div className="max-w-5xl mx-auto mt-20">
          <div className="space-y-16 text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-blue-500 leading-tight tracking-tight">
              Автоэкспорт напрямую от<br />проверенных поставщиков
            </h1>
            
            <div className="h-1 w-32 bg-blue-500 mx-auto rounded-full"></div>
            
            <div className="max-w-3xl mx-auto py-16 px-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <p className="text-3xl md:text-4xl text-blue-500 leading-relaxed font-light">
                Платформа для поиска и прямого сотрудничества<br />
                с надёжными автоэкспортными<br />
                компаниями по всему миру
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">Безопасные сделки</h3>
            <p className="text-gray-600">Все экспортные компании проходят тщательную проверку. Мы гарантируем безопасность ваших сделок.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">Лучшие цены</h3>
            <p className="text-gray-600">Прямое сотрудничество с экспортерами без посредников позволяет получить лучшие цены на рынке.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">Широкая география</h3>
            <p className="text-gray-600">Работаем с экспортными компаниями из Кореи, Японии, ОАЭ и других стран.</p>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Geometric Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Контакты</h3>
              <div className="space-y-2">
                <p>Email: info@exportplatform.com</p>
                <p>Тел: +7 (999) 123-45-67</p>
                <p>Москва, Пресненская наб., 12</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Информация</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">О компании</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Условия работы</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Политика конфиденциальности</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Услуги</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Поиск поставщиков</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Проверка компаний</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Сопровождение сделок</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Мы в соцсетях</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-xl">📱</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-xl">💬</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-xl">✈️</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
            © 2024 Export Platform. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
} 