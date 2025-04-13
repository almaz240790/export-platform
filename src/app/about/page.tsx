"use client";

import { Navbar } from '@/components/layout/Navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-8">
              О нас
            </h1>
            <p className="text-2xl font-light text-blue-500 italic mb-16">
              Мы верим, что границы — это просто линии на карте.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Export Platform — это место, где начинаются международные связи. Мы соединяем клиентов из России и стран СНГ с проверенными экспортными компаниями со всего мира. Без посредников. Без хаоса. Только прямое общение и реальные возможности.
            </p>
            
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Как и вы, мы любим простоту. Поэтому создали платформу, где всё прозрачно: найти партнёра, задать вопрос, начать сотрудничество. У нас нет каталогов с машинами — только компании, которые знают, как найти нужный автомобиль, оформить документы и доставить его куда угодно.
            </p>

            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              Мы за доверие. За технологии. И за то, чтобы экспорт стал таким же простым, как заказ путешествия.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 