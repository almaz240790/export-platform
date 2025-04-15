'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ExportRequestFormProps {
  onSubmit?: (data: FormData) => void;
  className?: string;
}

export function ExportRequestForm({ onSubmit, className = '' }: ExportRequestFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        {/* Личные данные */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-4">Личные данные</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя *
              </label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия *
              </label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон *
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Параметры автомобиля */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-4">Параметры автомобиля</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип автомобиля *
              </label>
              <select
                name="carType"
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">Выберите тип</option>
                <option value="sedan">Седан</option>
                <option value="suv">Внедорожник</option>
                <option value="sports">Спорткар</option>
                <option value="luxury">Премиум</option>
                <option value="commercial">Коммерческий</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Страна производства *
              </label>
              <select
                name="country"
                required
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">Выберите страну</option>
                <option value="KR">Южная Корея</option>
                <option value="JP">Япония</option>
                <option value="US">США</option>
                <option value="AE">ОАЭ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Желаемые марки
            </label>
            <input
              type="text"
              name="brands"
              placeholder="Например: Hyundai, KIA, Genesis"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Бюджет от (USD) *
              </label>
              <input
                type="number"
                name="budgetMin"
                required
                min="0"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Бюджет до (USD) *
              </label>
              <input
                type="number"
                name="budgetMax"
                required
                min="0"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Дополнительно */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold mb-4">Дополнительная информация</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Пожелания и комментарии
            </label>
            <textarea
              name="comments"
              rows={4}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Опишите ваши пожелания, требования или вопросы..."
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="terms"
                required
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label className="font-medium text-gray-700">
                Я согласен с обработкой персональных данных
              </label>
              <p className="text-gray-500">
                Нажимая кнопку, вы соглашаетесь с нашей политикой конфиденциальности
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Отправка...' : 'Отправить заявку'}
      </Button>
    </form>
  );
} 