import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SupplierRegistrationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-center mb-2">Регистрация экспортера</h1>
            <p className="text-gray-600 text-center mb-8">
              Создайте аккаунт для размещения вашей компании на платформе
            </p>

            <form className="grid gap-6">
              {/* Company Info */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Информация о компании</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название компании *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Страна *
                    </label>
                    <select
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Город *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Адрес
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Контактная информация</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
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
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Веб-сайт
                    </label>
                    <input
                      type="url"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">О бизнесе</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Год основания *
                    </label>
                    <input
                      type="number"
                      required
                      min="1900"
                      max="2024"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Количество сотрудников *
                    </label>
                    <select
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    >
                      <option value="">Выберите диапазон</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201+">201+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Типы автомобилей *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="ml-2">Легковые</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="ml-2">Премиум</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="ml-2">Коммерческие</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="ml-2">Спецтехника</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Описание компании *
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="Расскажите о вашей компании, опыте работы, преимуществах..."
                    />
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Безопасность</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Пароль *
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Подтверждение пароля *
                    </label>
                    <input
                      type="password"
                      required
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    required
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Я согласен с{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      условиями использования
                    </Link>{' '}
                    и{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      политикой конфиденциальности
                    </Link>
                  </span>
                </label>
              </div>

              <Button type="submit" variant="gradient" size="lg">
                Зарегистрироваться
              </Button>

              <p className="text-center text-sm text-gray-600">
                Уже есть аккаунт?{' '}
                <Link href="/login" className="text-primary hover:underline">
                  Войти
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
} 