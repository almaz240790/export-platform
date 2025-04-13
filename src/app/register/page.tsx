import Link from 'next/link';

export default function Register() {
  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Выберите тип регистрации
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Клиент */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Для клиентов
            </h2>
            <p className="text-gray-600 mb-8">
              Регистрация для поиска и покупки автомобилей через проверенные экспортные компании
            </p>
            <ul className="space-y-3 text-gray-600 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Простая регистрация через email или телефон
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Доступ к проверенным поставщикам
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Безопасные сделки
              </li>
            </ul>
            <Link 
              href="/register/client"
              className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
            >
              Зарегистрироваться как клиент
            </Link>
          </div>

          {/* Экспортная компания */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Для экспортных компаний
            </h2>
            <p className="text-gray-600 mb-8">
              Регистрация для экспортных компаний, желающих работать с клиентами напрямую
            </p>
            <ul className="space-y-3 text-gray-600 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Подтверждение статуса компании
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Прямой контакт с клиентами
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Расширение географии продаж
              </li>
            </ul>
            <Link 
              href="/register/company"
              className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center rounded-lg hover:opacity-90 transition-opacity"
            >
              Зарегистрироваться как компания
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 