'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, ChatBubbleLeftIcon, AdjustmentsHorizontalIcon, StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

type Company = {
  id: string;
  name: string;
  logo: string;
  rating: number;
  deals: number;
  location: string;
  specialization: string[];
  description: string;
  yearFounded: number;
  online: boolean;
  languages: string[];
  deliveryTime: string;
};

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Korea Auto Export Co.',
    logo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=200&h=200&fit=crop',
    rating: 4.8,
    deals: 234,
    location: 'Сеул, Корея',
    specialization: ['Hyundai', 'Kia', 'Genesis'],
    description: 'Прямые поставки автомобилей из Кореи. Работаем с заводами-производителями напрямую.',
    yearFounded: 2015,
    online: true,
    languages: ['Русский', 'Английский', 'Корейский'],
    deliveryTime: '30-45 дней'
  },
  {
    id: '2',
    name: 'Japan Cars Direct',
    logo: 'https://images.unsplash.com/photo-1544639977-f9d6cc6c7071?w=200&h=200&fit=crop',
    rating: 4.9,
    deals: 567,
    location: 'Токио, Япония',
    specialization: ['Toyota', 'Lexus', 'Nissan'],
    description: 'Специализируемся на премиальных японских автомобилях. Гарантия качества и полная прозрачность сделок.',
    yearFounded: 2012,
    online: false,
    languages: ['Русский', 'Английский', 'Японский'],
    deliveryTime: '40-50 дней'
  },
  {
    id: '3',
    name: 'German Auto Group',
    logo: 'https://images.unsplash.com/photo-1518539098065-62424cf2613f?w=200&h=200&fit=crop',
    rating: 4.7,
    deals: 789,
    location: 'Мюнхен, Германия',
    specialization: ['BMW', 'Mercedes', 'Audi'],
    description: 'Официальный экспортер немецких премиальных автомобилей. Индивидуальный подход к каждому клиенту.',
    yearFounded: 2010,
    online: true,
    languages: ['Русский', 'Английский', 'Немецкий'],
    deliveryTime: '20-30 дней'
  }
];

type SortOption = 'rating' | 'deals' | 'yearFounded';

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'company'}[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const allBrands = Array.from(
    new Set(mockCompanies.flatMap(company => company.specialization))
  );

  const allCountries = Array.from(
    new Set(mockCompanies.map(company => company.location.split(', ')[1]))
  );

  const filteredCompanies = mockCompanies
    .filter(company => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        company.name.toLowerCase().includes(searchLower) ||
        company.location.toLowerCase().includes(searchLower) ||
        company.specialization.some(spec => spec.toLowerCase().includes(searchLower));

      const matchesBrands = selectedBrands.length === 0 || 
        company.specialization.some(brand => selectedBrands.includes(brand));

      const matchesCountry = selectedCountries.length === 0 ||
        selectedCountries.includes(company.location.split(', ')[1]);

      return matchesSearch && matchesBrands && matchesCountry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'deals':
          return b.deals - a.deals;
        case 'yearFounded':
          return b.yearFounded - a.yearFounded;
        default:
          return 0;
      }
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const startChat = (company: Company) => {
    setSelectedCompany(company);
    setMessages([
      {
        text: `Здравствуйте! Я представитель компании ${company.name}. Чем могу помочь?`,
        sender: 'company'
      }
    ]);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessage = { text: chatMessage, sender: 'user' as const };
    setMessages(prev => [...prev, newMessage]);
    setChatMessage('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: 'Спасибо за ваше сообщение! Мы обработаем его в ближайшее время.',
        sender: 'company'
      }]);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-6">
          {/* Список компаний */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Экспортные компании
              </h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                Фильтры
              </button>
            </div>

            {showFilters && (
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Сортировать по:</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="rating">Рейтингу</option>
                      <option value="deals">Количеству сделок</option>
                      <option value="yearFounded">Году основания</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Страны:</h3>
                    <div className="space-y-2">
                      {allCountries.map(country => (
                        <label key={country} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCountries.includes(country)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCountries([...selectedCountries, country]);
                              } else {
                                setSelectedCountries(selectedCountries.filter(c => c !== country));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600"
                          />
                          {country}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Марки автомобилей:</h3>
                  <div className="flex flex-wrap gap-2">
                    {allBrands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => {
                          if (selectedBrands.includes(brand)) {
                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                          } else {
                            setSelectedBrands([...selectedBrands, brand]);
                          }
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedBrands.includes(brand)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск по названию, специализации или местоположению"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </form>

            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                      <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {company.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          company.online
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {company.online ? 'В сети' : 'Не в сети'}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{company.location}</p>
                      <p className="text-gray-600 mt-2">{company.description}</p>
                      <div className="flex items-center gap-6 mt-3">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-5 h-5 text-yellow-400" />
                          <span className="font-medium">{company.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          Сделок: {company.deals}
                        </span>
                        <span className="text-sm text-gray-600">
                          Основана: {company.yearFounded}
                        </span>
                        <span className="text-sm text-gray-600">
                          Доставка: {company.deliveryTime}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {company.specialization.map((spec) => (
                          <span
                            key={spec}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {company.languages.map((lang) => (
                          <span
                            key={lang}
                            className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => startChat(company)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      Написать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Чат */}
          {selectedCompany && (
            <div className="w-96 bg-white rounded-xl shadow-lg p-4 h-[calc(100vh-8rem)] flex flex-col">
              <div className="flex items-center gap-3 p-3 border-b">
                <div className="w-10 h-10 relative rounded-lg overflow-hidden">
                  <Image
                    src={selectedCompany.logo}
                    alt={selectedCompany.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedCompany.name}
                  </h3>
                  <p className={`text-sm ${
                    selectedCompany.online
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}>
                    {selectedCompany.online ? 'В сети' : 'Не в сети'}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="mt-4 border-t pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Введите сообщение..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Отправить
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 